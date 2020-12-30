const getDB = require("../../db");
const { formatDateToDB, createError } = require("../../helpers");

const editReservation = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    const { id_user, id_reservation } = req.params;
    const { fecha_inicio, fecha_fin, id_pack, id_espacio } = req.body;

    //comprobar si el usuario existe --> middleware userExists ✅
    //comprobar si el reserva existe --> middleware reservationExists ✅

    //comprobar si usuario coincide con el usuario que hizo la reserva [PENDIENTE]
    //comprobar que no han pasado más de un número máximo de horas desde la fecha de pedido para poder hacer modificaciones en la reserva
    const hoursLimit = 48;
    const bookings = await connection.query(
      `
    SELECT fecha_pedido FROM pedidos WHERE ID = ?`,
      [id_reservation]
    );

    const dateOfReservation = bookings[0][0].fecha_pedido;

    const numOfHours = Math.ceil(
      Math.abs(new Date().getTime() - new Date(dateOfReservation).getTime()) /
        (1000 * 3600)
    );

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

    if (new Date(fecha_inicio) > new Date(fecha_fin)) {
      throw await createError(
        "La fecha de fin debe ser posterior a la inicial",
        400
      );
    }
    //comprobar que las fechas están disponibles para el espacio, en caso contrario dar error 400 ✅
    const bookingOfSpace = await connection.query(
      `
        SELECT * FROM pedidos WHERE ((? BETWEEN fecha_inicio AND fecha_fin) OR (? BETWEEN fecha_inicio AND fecha_fin) )AND id_espacio =? AND ID = ?;
      `,
      [
        formatDateToDB(new Date(fecha_inicio)),
        formatDateToDB(new Date(fecha_fin)),
        id_espacio,
        id_reservation,
      ]
    );
    if (bookingOfSpace[0].length !== 0) {
      throw await createError("Espacio no disponible en esas fechas", 400);
    }

    // calcular precio y devolver la información de la reserva
    //precio base del espacio
    const place = await connection.query(
      `SELECT * FROM espacios WHERE ID = ?`,
      [id_espacio]
    );
    const spacePricePerDay = place[0][0].precio;
    //precio del pack añadido al espacio
    const pack = await connection.query(
      `
      SELECT * FROM packs WHERE ID = ?`,
      [id_pack]
    );
    const packPrice = pack[0][0].precio;
    //precio en función del número de días se deseen contratar
    const numOfDays = Math.ceil(
      Math.abs(
        new Date(fecha_fin).getTime() - new Date(fecha_inicio).getTime()
      ) /
        (1000 * 3600 * 24)
    );
    const totalPriceReservation = numOfDays * (spacePricePerDay + packPrice);

    await connection.query(
      `
    UPDATE pedidos SET fecha_inicio=?,fecha_fin=?,precio_pedido=?,id_espacio=?,id_pack=? WHERE ID = ?
    `,
      [
        formatDateToDB(new Date(fecha_inicio)),
        formatDateToDB(new Date(fecha_fin)),
        totalPriceReservation,
        id_espacio,
        id_pack,
        id_reservation,
      ]
    );

    res.send({
      status: "ok",
      data: {
        fecha_pedido: formatDateToDB(new Date()),
        fecha_inicio: formatDateToDB(new Date(fecha_inicio)),
        fecha_fin: formatDateToDB(new Date(fecha_fin)),
        precio_pedido: totalPriceReservation,
        id_usuario: id_user,
        id_espacio: id_espacio,
        id_pack,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = editReservation;
