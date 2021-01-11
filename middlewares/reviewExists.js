const { createError, isId } = require("../helpers");

const reviewExists = async (req, res, next) => {
  let connection;

  try {
    connection = await req.app.locals.getDB();

    const { id_review } = req.params;

    isId(id_review);

    const [user] = await connection.query(
      `
      SELECT id FROM review WHERE ID=?
    `,
      [id_review]
    );

    if (user.length === 0) {
      throw createError(
        "El ID introducido no se corresponde con ninguna valoración",
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

module.exports = reviewExists;
