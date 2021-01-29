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
      category,
      date,
      solved,
      orderBy,
      orderDirection,
    } = req.query;

    //Modificamos algunos campos para que no den problemas a la hora de validarlos
    if (category) category = category.toLowerCase();
    if (orderBy) orderBy = orderBy.toLowerCase();
    orderBy = orderBy ? orderBy.toLowerCase() : "id";
    orderDirection = orderDirection ? orderDirection.toUpperCase() : "ASC";

    await validator(filterReportSchema, {
      report_id,
      user,
      user_name,
      space,
      category,
      date,
      solved,
      orderBy,
      orderDirection,
    });

    const [results] = await connection.query(
      `
        SELECT r.id "id", category, description, solved, report_date, r.photo, CONCAT(u.name, " ", u.surname) "user_name", user_id, space_id
        FROM reports r JOIN users u ON r.user_id = u.id
        WHERE (r.id = ? OR ?) 
                AND (user_id = ? OR ?)
                AND (space_id = ? OR ?) 
                AND (DATE(report_date) = DATE(?) OR ?) 
                AND (category = ? OR ?) 
                AND (solved = ? OR ?)
                AND (CONCAT(u.name, " ", u.surname) LIKE ? OR ?)
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
