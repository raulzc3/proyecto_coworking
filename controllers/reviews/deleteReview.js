const deleteReview = async (req, res, next) => {
  let connection;
  try {
    connection = await req.app.locals.getDB();
    const {  review_id } = req.params;

    await connection.query(
      `DELETE FROM reviews WHERE ID= ?;`,
      [ review_id]
    );

    res.send({
      stats: "ok",
      message: `La valoración con id ${review_id} fue borrada de la tabla valoraciones`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = deleteReview;
