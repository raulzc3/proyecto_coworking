const getDB = require("../../db");
const { createError } = require("../../helpers");

const filterReports = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const categories = [
      "hardware",
      "software",
      "conectividad",
      "limpieza",
      "atención al cliente",
      "otros",
    ];

    // Filtrar por id, usuario, espacio, categoria, fecha de incidencia y estado

    let { reportId, user, space, date, category, solved } = req.query;

    if (category && !categories.includes(category.toLowerCase())) {
      throw createError("La categoría introducida no es válida.", 400);
    }
    const [results] = await connection.query(
      `
        SELECT *
        FROM reports
        WHERE (id = ? OR ?) 
                AND (user_id = ? OR ?)
                AND (space_id = ? OR ?) 
                AND (report_date = ? OR ?) 
                AND (category = ? OR ?) 
                AND (solved = ? OR ?);
    `,
      [
        reportId,
        !reportId,
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
