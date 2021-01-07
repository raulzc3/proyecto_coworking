const getDB = require("../db");
const { createError, isId } = require("../helpers");
const userExists = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { user_id } = req.params;

    isId(user_id);

    const [user] = await connection.query(
      `
      SELECT ID FROM users WHERE ID=?
    `,
      [user_id]
    );

    if (user.length === 0) {
      throw createError("Este usuario no existe", 404);
    }

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = userExists;
