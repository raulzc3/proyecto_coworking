const { validator } = require("../../helpers");
const { filterReportSchema } = require("../../schemas");

const filterReports = async (req, res, next) => {
  let connection;

  try {
    connection = await req.app.locals.getDB();

    let {
      report_id,
      user,
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
    orderBy = orderBy ? orderBy.toLowerCase() : "report_date";
    orderDirection = orderDirection ? orderDirection.toUpperCase() : "ASC";

    await validator(filterReportSchema, {
      report_id,
      user,
      space,
      category,
      date,
      solved,
      orderBy,
      orderDirection,
    });

    const [results] = await connection.query(
      `
        SELECT *
        FROM reports
        WHERE (id = ? OR ?) 
                AND (user_id = ? OR ?)
                AND (space_id = ? OR ?) 
                AND (DATE(report_date) = DATE(?) OR ?) 
                AND (category = ? OR ?) 
                AND (solved = ? OR ?)
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
