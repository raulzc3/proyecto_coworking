const getDB = require("../../db");
const { savePhoto, formatDateToDB } = require("../../helpers");

const newReport = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    const categories = [
      "Hardware",
      "Software",
      "Conectividad",
      "Limpieza",
      "Atención al cliente",
      "Otros",
    ];
    // Obtenemos los campos necesarios de req.body

    const { category, description } = req.fields;
    const { user, space } = req.params;

    console.log(req.files);

    if (!categories.includes(category)) {
      const error = new Error("La categoría introducida no es válida");
      error.httpStatus = 400;
      throw error;
    } else if (!description) {
      const error = new Error("El campo 'descripción' es obligatorio");
      error.httpStatus = 400;
      throw error;
    }

    // Creamos un objeto con la fecha actual
    const now = new Date();

    // Procesamos la imagen:

    let reportPhoto = "";

    if (req.files && Object.keys(req.files).length > 0) {
      reportPhoto = await savePhoto(req.files.photo);
    }

    //Ejecuto la inserción en la base de datos
    const [result] = await connection.query(
      `
      INSERT INTO reportes (categoria, descripcion, fecha_incidencia, id_usuario, id_espacio, foto)
      VALUES (?, ?, ?, ?, ?, ?);
      `,
      [category, description, formatDateToDB(now), user, space, reportPhoto]
    );

    const { insertId } = result;

    res.send({
      status: "ok",
      data: {
        id: insertId,
        categoria: category,
        description,
        fecha_incidencia: now,
        id_usuario: user,
        id_espacio: space,
        photo: reportPhoto,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newReport;
