const getDB = require("../../db");
const { formatDateToDB, createError, dateValidator } = require("../../helpers");

const editReservation = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    const { user_id, reservation_id } = req.params;
    const { start_date, end_date, pack_id, space_id } = req.body;

    //comprobar si el usuario existe --> middleware userExists ✅
    //comprobar si el reserva existe --> middleware reservationExists ✅

    //la fecha de inicio no puede ser posterior a la fecha actual ✅
    if (!dateValidator(new Date(start_date)))
      throw createError("La fecha inicial debe ser posterior a la actual", 400);

    //comprobar si usuario coincide con el usuario que hizo la reserva [PENDIENTE]
    //comprobar que no han pasado más de un número máximo de horas desde la fecha de pedido para poder hacer modificaciones en la reserva
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
    console.log(bookings[0][0]);
    console.log(dateOfReservation);
    console.log(new Date());
    console.log(numOfHours);

    if (numOfHours >= 48) {
      throw createError(
        `límite de ${hoursLimit} horas superado. No es posible modificar reserva`,
        405
      );
    }
    // comprobar que la fecha de inicio es posterio a la de fin dar un error ✅

    if (new Date(start_date) > new Date(end_date)) {
      throw await createError(
        "La fecha de fin debe ser posterior a la inicial",
        400
      );
    }
    //comprobar que las fechas están disponibles para el espacio, en caso contrario dar error 400 ✅
    const bookingOfSpace = await connection.query(
      `
        SELECT * FROM orders WHERE ((? BETWEEN start_date AND end_date) OR (? BETWEEN start_date AND end_date) )AND space_id =? AND ID = ?;
      `,
      [
        formatDateToDB(new Date(start_date)),
        formatDateToDB(new Date(end_date)),
        space_id,
        reservation_id,
      ]
    );
    if (bookingOfSpace[0].length !== 0) {
      throw await createError("Espacio no disponible en esas fechas", 400);
    }

    // calcular precio y devolver la información de la reserva
    //precio base del espacio
    const place = await connection.query(`SELECT * FROM spaces WHERE ID = ?`, [
      space_id,
    ]);
    const spacePricePerDay = place[0][0].price;
    //precio del pack añadido al espacio
    const pack = await connection.query(
      `
      SELECT * FROM packs WHERE ID = ?`,
      [pack_id]
    );
    const packPrice = pack[0][0].price;
    //precio en función del número de días se deseen contratar
    const numOfDays = Math.ceil(
      Math.abs(new Date(end_date).getTime() - new Date(start_date).getTime()) /
        (1000 * 3600 * 24)
    );
    const totalPriceReservation = numOfDays * (spacePricePerDay + packPrice);

    await connection.query(
      `
    UPDATE orders SET start_date=?,end_date=?,price=?,space_id=?,pack_id=? WHERE ID = ?
    `,
      [
        formatDateToDB(new Date(start_date)),
        formatDateToDB(new Date(end_date)),
        totalPriceReservation,
        space_id,
        pack_id,
        reservation_id,
      ]
    );

    res.send({
      status: "ok",
      data: {
        order_date: formatDateToDB(new Date()),
        start_date: formatDateToDB(new Date(start_date)),
        end_date: formatDateToDB(new Date(end_date)),
        price: totalPriceReservation,
        user_id,
        space_id,
        pack_id,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = editReservation;
