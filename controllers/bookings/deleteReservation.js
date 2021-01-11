const { createError } = require("../../helpers");
const deleteReservation = async (req, res, next) => {
  let connection;
  try {
    connection = await req.app.locals.getDB();
    const { user_id, reservation_id } = req.params;

    // si el id de usuario no existe dar error --> middleware userExists ✅
    //si el id de espacio no existe dar error --> middleware spaceExists ✅
    //conprobar que el usuario de la reserva coincide con el usuario que desea eliminar la reserva   --> middleware isAuthorized ✅
    await connection.query(`DELETE FROM orders WHERE ID = ?`, [reservation_id]);
    //comprobar que no han pasado más de un número máximo de horas desde la fecha de pedido para poder hacer modificaciones en laeliminar la reserva
    const hoursLimit = 48;
    const bookings = await connection.query(
      `
 SELECT order_date FROM orders WHERE ID = ?`,
      [reservation_id]
    );

    const dateOfReservation = bookings[0][0].order_date;

    const numOfHours = Math.ceil(
      Math.abs(new Date().getTime() - new Date(dateOfReservation).getTime()) /
        (1000 * 3600)
    );

    if (numOfHours >= 48) {
      throw createError(
        `límite de ${hoursLimit} horas superado. No es posible eliminar reserva`,
        405
      );
    }
    res.send({
      status: "ok",
      message: `Reserva  con ID ${reservation_id} ha sido eliminada`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = deleteReservation;
