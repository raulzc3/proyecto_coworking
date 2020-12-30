const getDB = require("../../db");
const { savePhoto } = require("../../helpers");

const newReport = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    const categories = [
      "hardware",
      "software",
      "conectividad",
      "limpieza",
      "atención al cliente",
      "otros",
    ];

    //Obtenemos los datos necesario de req.params
    const { id_user, id_space } = req.params;

    // Obtenemos los campos necesarios de req.body
    const { category, description } = req.body;

    // Comprobamos que exista un pedido activo para el usuario y espacio introducidos
    let [order] = await connection.query(
      `
    SELECT * 
    FROM pedidos 
    WHERE (CURDATE() BETWEEN fecha_inicio AND fecha_fin) 
          AND id_usuario = ?
          AND id_espacio = ?;
    `,
      [id_user, id_space]
    );

    //Devolvemos errores si no se cumplen las condiciones necesarias
    if (order.length === 0) {
      const error = new Error(
        "No existe ninguna reserva activa para la combinación usuario-espacio introducida"
      );
      error.httpStatus = 400;
      throw error;
    } else if (!categories.includes(category.toLowerCase())) {
      const error = new Error("La categoría introducida no es válida");
      error.httpStatus = 400;
      throw error;
    } else if (!description) {
      const error = new Error("El campo 'descripción' es obligatorio");
      error.httpStatus = 400;
      throw error;
    }

    // Procesamos la imagen:
    let reportPhoto = null;

    if (req.files && Object.keys(req.files).length > 0) {
      reportPhoto = await savePhoto(req.files.photo, "reports");
    }

    //Ejecutamos la inserción en la base de datos
    const [insertResult] = await connection.query(
      `
      INSERT INTO reportes (categoria, descripcion, id_usuario, id_espacio, foto)
      VALUES (?, ?, ?, ?, ?);
      `,
      [category, description, id_user, id_space, reportPhoto]
    );

    const { insertId } = insertResult;

    const [
      result,
    ] = await connection.query(`SELECT * FROM  reportes WHERE id = ?;`, [
      insertId,
    ]);

    res.send({
      status: "ok",
      data: {
        ...result["0"],
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newReport;
