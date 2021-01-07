const getDB = require("../../db");
const { validator } = require("../../helpers");
const { filterReportSchema } = require("../../schemas");
const filterReports = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Filtrar por id, usuario, espacio, categoria, fecha de incidencia y estado

    let { report_id, user, space, date, category, solved } = req.query;
    if (category) category = category.toLowerCase();

    await validator(filterReportSchema, {
      report_id,
      user,
      space,
      category,
      date,
      solved,
    });

    console.log(date);
    const [results] = await connection.query(
      `
        SELECT *
        FROM reports
        WHERE (id = ? OR ?) 
                AND (user_id = ? OR ?)
                AND (space_id = ? OR ?) 
                AND (DATE(report_date) = DATE(?) OR ?) 
                AND (category = ? OR ?) 
                AND (solved = ? OR ?);
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
      ]
    );

    res.send({
      status: "ok",
      data: {
        ...results,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = filterReports;
