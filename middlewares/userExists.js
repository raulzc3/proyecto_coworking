const getDB = require("../db");
const { createError } = require("../helpers");

const userExists = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id_user } = req.params;

    console.log(id_user);

    const [user] = await connection.query(
      `
      SELECT id FROM users WHERE ID=?
    `,
      [id_user]
    );

    if (user.length === 0) {
      throw createError(
        "El ID introducido no se corresponde con ningún usuario",
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
