const getDB = require("../db");
const { createError } = require("../helpers");

const reportExists = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id_report } = req.params;

    console.log(id_report);

    const [user] = await connection.query(
      `
      SELECT id FROM reports WHERE ID=?
    `,
      [id_report]
    );

    if (user.length === 0) {
      throw createError(
        "El ID introducido no se corresponde con ningún reporte",
        404
      );
    }

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = reportExists;
