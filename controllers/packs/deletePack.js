const getDB = require("../../db");
const { createError, deletePhoto } = require("../../helpers");

const deletePack = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    //obtengo el id del pack que voy a eliminar de los parámetros
    const { id } = req.params;
    //Obtengo el nombre de esa foto en el servidor
    const [fotoQuery] = await connection.query(
      `
      SELECT foto FROM packs
      WHERE  ID=?`,
      [id]
    );
    let foto = fotoQuery[0].foto;
    //Borro la foto del servidor
    await deletePhoto(foto, "packs");

    //elimino el pack con dicho id de la tabla packs
    await connection.query(`DELETE FROM packs WHERE ID= ? ;`, [id]);

    res.send({
      stats: "ok",
      message: `El pack con id ${id} fue borrada de la tabla packs`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deletePack;
