const getDB = require("../../db");
const { createError, savePhoto } = require("../../helpers");

const newPack = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    //Saco los campos del body not null del body: tipo, texto_contenido,precio
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

    //Compruebo si se envió foto y si es correcta
    if (!req.files || Object.keys(req.files).length !== 1) {
      throw createError("la foto introducida no sirve", 400);
    }
    // Guardar la imagen y conseguir el nombre del fichero
    const foto = await savePhoto(req.files.foto, "packs");

    //Inserto en la base de datos el nuevo pack
    const [result] = await connection.query(
      `
    INSERT INTO packs (tipo, texto_contenido,precio,foto)
    VALUES (?,?,?,?);
    `,
      [tipo, texto_contenido, precio, foto]
    );

    //obtengo la id del nuevo dato insertado
    const { insertId } = result;

    res.send({
      status: "ok",
      data: {
        id: insertId,
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

module.exports = newPack;
