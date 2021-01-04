const getDB = require("../db");
const { createError } = require("../helpers");

const userExists = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id } = req.params;


    const [user] = await connection.query(
      `
      SELECT id FROM packs WHERE ID=?
    `,
      [id]
    );

    if (user.length === 0) {
      throw createError(
        "El ID introducido no se corresponde con ningún pack",
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

module.exports = userExists;
