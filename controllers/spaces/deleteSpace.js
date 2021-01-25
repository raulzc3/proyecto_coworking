const { deletePhoto } = require("../../helpers");

const deleteSpace = async (req, res, next) => {
  let connection;
  try {
    connection = await req.app.locals.getDB();
    //Obtengo el id del espacio que voy a deshabilitar (eliminar)
    const { space_id } = req.params;

    //? //Busco las fotos del espacio en cuestión en la carpeta /space/:id_space
    //? //Obtengo el nomre de sus fotos en el servidor
    //const [photoQuery] = await connection.query(
    //  `
    //SELECT url FROM photos
    //WHERE space_id=?;`,
    //  [space_id]
    //);

    //for (const item of photoQuery) {
    //? //Borro las photos del servidor
    //  await deletePhoto(item.url, `spaces/${space_id}`);
    //}

    //elimino Dichas fotos con dicho id de la tabla photo? no puedo... esta como FK en spaces
    //await connection.query(`DELETE FROM photos WHERE space_id= ? ;`, [space_id]);

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
