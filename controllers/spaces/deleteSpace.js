const getDB = require("../../db");

const deleteSpace = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    const { id } = req.params;

    await connection.query(
      `DELETE FROM spaces WHERE ID= ?;`,
      [id]
    );

    res.send({
      stats: "ok",
      message: `El espacio con id : ${id} fue borrada de la tabla spaces`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = deleteSpace;
