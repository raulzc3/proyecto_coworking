const getDB = require("../../db");
const { createError, formatDateToDB } = require("../../helpers");

const newReview = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    //Obtenemos los datos necesario de req.params
    const { space_id, user_id } = req.params;
    console.log(space_id, user_id);
    // Obtenemos los campos necesarios de req.body
    const { comment, score } = req.body;

    //****//Obtenemos la data actual
    //****const review_date= formatDateToDB(new Date());

    // Comprobamos que exista un pedido pasado para el usuario y espacio introducidos
    let [order] = await connection.query(
      `
      SELECT * 
      FROM orders 
      WHERE (CURDATE() > end_date) 
            AND user_id = ?
            AND space_id = ?;
      `,
      [user_id, space_id]
    );

    //Devolvemos errores si no se cumplen las condiciones necesarias
    if (order.length === 0) {
      const error = new Error(
        "No existe ninguna reserva pasada para la combinación usuario-espacio introducida"
      );
      error.httpStatus = 400;
      throw error;
    } else if (!comment) {
      const error = new Error("El campo 'comment' es obligatorio");
      error.httpStatus = 400;
      throw error;
    }

    //Ejecutamos la inserción en la base de datos
    const [insertResult] = await connection.query(
      `
        INSERT INTO reviews (comment,score,user_id,space_id)
        VALUES (?, ?, ?, ?);
        `,
      [comment, score, user_id, space_id]
    );

    const { insertId } = insertResult;

    const [
      result,
    ] = await connection.query(`SELECT * FROM  reviews WHERE id = ?;`, [
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

module.exports = newReview;
