const { deletePhoto } = require("../../helpers");

const deletePack = async (req, res, next) => {
  let connection;

  try {
    connection = await req.app.locals.getDB();

    //obtengo el id del pack que voy a eliminar de los parámetros
    const { pack_id } = req.params;
    //Obtengo el nombre de esa photo en el servidor
    const [photoQuery] = await connection.query(
      `
      SELECT photo FROM packs
      WHERE  ID=?`,
      [pack_id]
    );
    let photo = photoQuery[0].photo;
    //Borro la photo del servidor
    await deletePhoto(photo, "packs");

    //elimino el pack con dicho id de la tabla packs
    await connection.query(`DELETE FROM packs WHERE ID= ? ;`, [pack_id]);

    res.send({
      stats: "ok",
      message: `El pack con id ${pack_id} fue borrado de la tabla packs`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deletePack;
