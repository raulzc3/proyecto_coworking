const getDB = require("../../db");
const { formatDateToDB, createError } = require("../../helpers");
//onst { createError } = require("../../helpers");

const getReservation = async (req, res, next) => {
  let connection;
  let reservation = [];
  try {
    connection = await getDB();
    const { id_user } = req.params;
    const { sort } = req.query;
    const validFieldsOfsSort = ["current", "pending", "finished"];
    const sortBy = validFieldsOfsSort.includes(sort) ? sort : " ";
    console.log(sortBy);

    // si el id de usuario no existe dar error --> middleware userExists ✅

    //si existe se enlistan las reservas hechas según el fintro indicado ✅
    let orders;

    switch (sortBy) {
      case "current":
        orders = await connection.query(
          `
           SELECT * FROM pedidos WHERE id_usuario = ? AND (? BETWEEN fecha_inicio AND fecha_fin) ORDER BY ID;`,
          [id_user, formatDateToDB(new Date())]
        );
        break;

      case "pending":
        orders = await connection.query(
          `
             SELECT * FROM pedidos WHERE id_usuario = ? AND ? < fecha_inicio ORDER BY ID;`,
          [id_user, formatDateToDB(new Date())]
        );
        break;
      case "finished":
        orders = await connection.query(
          `
               SELECT * FROM pedidos WHERE id_usuario = ? AND ? > fecha_fin ORDER BY ID ;`,
          [id_user, formatDateToDB(new Date("2022-02-02"))]
        );
        break;
      default:
        orders = await connection.query(
          `SELECT * FROM pedidos WHERE id_usuario = ?;`,
          [id_user]
        );
        break;
    }

    for (const order of orders[0]) {
      reservation.push(order);
    }
    res.send({
      status: "ok",
      data: { ...reservation },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = getReservation;
