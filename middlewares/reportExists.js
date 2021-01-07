const getDB = require("../db");
const { createError, isId } = require("../helpers");

const reportExists = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { report_id } = req.params;

    isId(report_id);

    const [user] = await connection.query(
      `
      SELECT id FROM reports WHERE ID=?
    `,
      [report_id]
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
