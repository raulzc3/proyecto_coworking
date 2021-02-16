const { validator } = require("../../helpers");
const { filterReportSchema } = require("../../schemas");

const filterReports = async (req, res, next) => {
  let connection;

  try {
    connection = await req.app.locals.getDB();

    let {
      report_id,
      user,
      user_name,
      space,
      space_name,
      category,
      date,
      solved,
      order,
      direction,
    } = req.query;

    //Modificamos algunos campos para que no den problemas a la hora de validarlos
    if (category) category = category.toLowerCase();
    const orderBy = order ? order.toLowerCase() : "id";
    const orderDirection = direction ? direction.toUpperCase() : "ASC";

    await validator(filterReportSchema, {
      report_id,
      user,
      user_name,
      space,
      space_name,
      category,
      date,
      solved,
      orderBy,
      orderDirection,
    });

    const [results] = await connection.query(
      `
        SELECT r.id "ID", r.category, r.description, r.solved, r.report_date, r.photo, 
              CONCAT(u.name, " ", u.surname) "user_name", user_id, space_id, s.name "space_name"
        FROM reports r JOIN users u ON r.user_id = u.id JOIN spaces s ON r.space_id = s.id
        WHERE (r.id = ? OR ?) 
                AND (user_id = ? OR ?)
                AND (space_id = ? OR ?) 
                AND (DATE(report_date) = DATE(?) OR ?) 
                AND (category = ? OR ?) 
                AND (solved = ? OR ?)
                AND (CONCAT(u.name, " ", u.surname) LIKE ? OR ?)
                AND (s.name LIKE ? or ?)
                ORDER BY ${orderBy} ${orderDirection};
    `,
      [
        report_id,
        !report_id,
        user,
        !user,
        space,
        !space,
        date,
        !date,
        category,
        !category,
        solved,
        !solved,
        `%${user_name}%`,
        !user_name,
        `%${space_name}%`,
        !space_name,
      ]
    );

    res.send({
      status: "ok",
      data: [...results],
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = filterReports;
