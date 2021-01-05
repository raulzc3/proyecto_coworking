const getDB = require("../../db");

const deleteReview = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    const { id, id_review } = req.params;

    await connection.query(
      `DELETE FROM valoraciones WHERE ID= ? AND id_review= ? ;`,
      [id, id_review]
    );

    res.send({
      stats: "ok",
      message: `La valoración del espacio ${id} con id ${id_review} fue borrada de la tabla valoraciones`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = deleteReview;
