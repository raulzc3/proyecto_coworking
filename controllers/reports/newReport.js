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
    const { user_id, space_id } = req.params;

    // Obtenemos los campos necesarios de req.body
    const { category, description } = req.body;

    // Comprobamos que exista un pedido activo para el usuario y espacio introducidos
    let [order] = await connection.query(
      `
    SELECT * 
    FROM orders 
    WHERE (CURDATE() BETWEEN start_date AND end_date) 
          AND user_id = ?
          AND space_id = ?;
    `,
      [user_id, space_id]
    );

    //Devolvemos errores si no se cumplen las condiciones necesarias
    if (order.length === 0) {
      const error = new Error(
        "No existe ninguna reserva activa para la combinación usuario-espacio introducida"
      );
      error.httpStatus = 400;
      throw error;
    } else if (
      category === undefined ||
      !categories.includes(category.toLowerCase())
    ) {
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
      console.log(req.files.photo);
    }

    //Ejecutamos la inserción en la base de datos
    const [insertResult] = await connection.query(
      `
      INSERT INTO reports (category, description, user_id, space_id, photo)
      VALUES (?, ?, ?, ?, ?);
      `,
      [category, description, user_id, space_id, reportPhoto]
    );

    const { insertId } = insertResult;

    const [
      result,
    ] = await connection.query(`SELECT * FROM  reports WHERE id = ?;`, [
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
