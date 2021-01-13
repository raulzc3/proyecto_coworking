const deleteSpace = async (req, res, next) => {
  let connection;
  try {
    connection = await req.app.locals.getDB();
    const { space_id } = req.params;

    //Desabilitamos/Habilitamos el espacio
    await connection.query(
      `
      UPDATE spaces s1, spaces s2 
      SET s1.enabled = IF(s2.enabled = 0, 1, 0)     
      WHERE s1.id = s2.id AND s1.id = ?;

    `,
      [space_id]
    );
    res.send({
      stats: "ok",
      message: `El espacio con id : ${space_id} ha sido desabilitado`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = deleteSpace;
