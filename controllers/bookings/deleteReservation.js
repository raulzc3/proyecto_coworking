const { createError, distanceDateInHours } = require("../../helpers");
const deleteReservation = async (req, res, next) => {
  let connection;
  try {
    connection = await req.app.locals.getDB();
    const { reservation_id } = req.params;

    // si el id de usuario no existe dar error --> middleware userExists ✅
    //comprobar que no han pasado más de un número máximo de horas desde la fecha de pedido para poder hacer modificaciones en laeliminar la reserva
    const hoursLimit = 48;
    const bookings = await connection.query(
      `
 SELECT order_date, start_date FROM orders WHERE ID = ?`,
      [reservation_id]
    );

    const dateOfReservation = bookings[0][0].order_date;
    const dateOfStartReservation = bookings[0][0].start_date;

    const numOfHoursSinceOrder = distanceDateInHours(
      new Date(),
      new Date(dateOfReservation)
    );

    const numOfHoursBetweenOrderAndStart = distanceDateInHours(
      new Date(dateOfStartReservation),
      new Date(dateOfReservation)
    );

    console.log(numOfHoursSinceOrder);
    console.log(numOfHoursBetweenOrderAndStart);
    //comprobar que la distancia entre la fecha de pedido y la fecha de inicio de reserva es mayor de 48 horas, de no ser así no se puede editar la reserva
    if (numOfHoursBetweenOrderAndStart <= 48 && !req.userAuth.admin) {
      throw createError(
        `Esta reserva a está a ${hoursLimit} horas o menos de empezar. No es posible eliminarla`,
        405
      );
    }
    //comprobar que la distancia entre la fecha de pedido si la fecha actual es de 48 horas, de ser así no se puede editar la reserva
    if (numOfHoursSinceOrder >= 48 && !req.userAuth.admin) {
      throw createError(
        `límite de ${hoursLimit} horas superado. No es posible eliminar reserva`,
        405
      );
    }
    //si el id de espacio no existe dar error --> middleware spaceExists ✅
    //conprobar que el usuario de la reserva coincide con el usuario que desea eliminar la reserva   --> middleware isAuthorized ✅
    await connection.query(`DELETE FROM orders WHERE ID = ?`, [reservation_id]);
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
