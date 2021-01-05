const getDB = require("../db");
const { createError, isId } = require("../helpers");
const spaceExists = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id_space } = req.params;

    isId(id_space);

    const [space] = await connection.query(
      `
      SELECT id FROM spaces WHERE ID=?
    `,
      [id_space]
    );

    if (space.length === 0) {
      throw createError("Esta espacio no existe", 404);
    }

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = spaceExists;
