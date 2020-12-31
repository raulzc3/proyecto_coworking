const getDB = require("../../db");
const { createError, deletePhoto, savePhoto } = require("../../helpers");

const editPack = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    //obtengo el id del pack a modificar del endpoint
    const { id } = req.params;

    //Saco los campos del body not null del body: tipo, texto_contenido,precio,foto
    const { tipo, texto_contenido, precio } = req.body;

    //Compruebo que existen
    if (!tipo || !texto_contenido || !precio) {
      throw createError("Faltan campos", 400);
    }
    //Compruebo que son válidos
    const tipoArray = ["Básico", "Intermedio", "Audiovisual", "Informático"];
    if (
      !tipoArray.includes(tipo) ||
      texto_contenido.length > 60000 ||
      precio < 0
    ) {
      throw createError("campo inválido", 400);
    }

    [fotoQuery] = await connection.query(
      `
    SELECT foto FROM packs
    WHERE  ID=?`,
      [id]
    );
    let foto = fotoQuery[0].foto;

    ("644b614c-c15c-45fb-a81e-a17e4a2a76a9.jpg");
    //Compruebo si se envió foto y si es correcta
    if (req.files && Object.keys(req.files).length === 1) {
      //Primero borro la foto del servidor
      await deletePhoto(foto, "packs");
      // Guardar la imagen y conseguir el nombre del fichero
      foto = await savePhoto(req.files.foto, "packs");
    }

    //hago un query de SQL Update para editar los datos
    await connection.query(
      `
    UPDATE packs SET tipo=?,texto_contenido=?,precio=?,foto=?
    WHERE ID=?
    ;`,
      [tipo, texto_contenido, precio, foto, id]
    );

    res.send({
      status: "ok",
      data: {
        id,
        tipo,
        texto_contenido,
        precio,
        foto,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editPack;
