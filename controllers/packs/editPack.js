const getDB = require("../../db");
const { createError, deletePhoto, savePhoto } = require("../../helpers");

const editPack = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    //obtengo el id del pack a modificar del endpoint
    const { id } = req.params;

    //Saco los campos del body not null del body: tipo, texto_contenido,precio,foto
    const { type, content, price } = req.body;

    //Compruebo que existen
    if (!type || !content || !price) {
      throw createError("Faltan campos", 400);
    }
    //Compruebo que son válidos
    const typeArray = ["Básico", "Intermedio", "Audiovisual", "Informático"];
    if (
      !typeArray.includes(type) ||
      content.length > 60000 ||
      price < 0
    ) {
      throw createError("campo inválido", 400);
    }
//Obtengo el nombre de la foto
    [photoQuery] = await connection.query(
      `
    SELECT photo FROM packs
    WHERE  ID=?`,
      [id]
    );
    let photo = photoQuery[0].photo;

    ("644b614c-c15c-45fb-a81e-a17e4a2a76a9.jpg");
    //Compruebo si se envió foto y si es correcta
    if (req.files && Object.keys(req.files).length === 1) {
      //Primero borro la foto del servidor
      await deletePhoto(photo, "packs");
      // Guardar la imagen y conseguir el nombre del fichero
      photo = await savePhoto(req.files.photo, "packs");
    }

    //hago un query de SQL Update para editar los datos
    await connection.query(
      `
    UPDATE packs SET type=?,content=?,price=?,photo=?
    WHERE ID=?
    ;`,
      [type, content, price, photo, id]
    );

    res.send({
      status: "ok",
      data: {
        id,
        type,
        content,
        price,
        photo,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editPack;
