const deleteSpace = async (req, res, next) => {
  let connection;
  try {
    connection = await req.app.locals.getDB();
    const { space_id } = req.params;

    await connection.query(`DELETE FROM spaces WHERE ID= ?;`, [space_id]);

    res.send({
      stats: "ok",
      message: `El espacio con id : ${space_id} fue borrada de la tabla spaces`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = deleteSpace;
