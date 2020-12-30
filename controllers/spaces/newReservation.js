const getDB = require("../../db");
const { formatDateToDB, createError } = require("../../helpers");

const newReservation = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    const { id_user, id_space } = req.params;
    const { fecha_inicio, fecha_fin, id_pack } = req.body;

    // si el id de usuario no existe dar error --> middleware userExists ✅

    //si el id de espacio no existe dar error --> middleware spaceExists ✅
    // si la fecha de inicio es posterio a la de fin dar un error ✅

    if (new Date(fecha_inicio) > new Date(fecha_fin)) {
      throw createError("La fecha de fin debe ser posterior a la inicial", 400);
    }
    // si el espacio está ocupado en las mismas fechas dar error

    const bookingOfSpace = await connection.query(
      `
      SELECT * FROM pedidos WHERE ((? BETWEEN fecha_inicio AND fecha_fin) OR (? BETWEEN fecha_inicio AND fecha_fin) )AND id_espacio =?;
    `,
      [
        `${formatDateToDB(new Date(fecha_inicio))}`,
        `${formatDateToDB(new Date(fecha_fin))}`,
        id_space,
      ]
    );

    if (bookingOfSpace[0].length !== 0) {
      throw createError("Espacio no disponible en esas fechas", 400);
    }

    //En caso de que exista hay que calcular precio y devolver la información de la reserva
    //precio base del espacio
    const place = await connection.query(
      `SELECT * FROM espacios WHERE ID = ?`,
      [id_space]
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

    const totalPriceResservation = numOfDays * (spacePricePerDay + packPrice);
    console.log(totalPriceResservation);

    await connection.query(
      `
    INSERT INTO pedidos (fecha_inicio, fecha_fin,precio_pedido, id_usuario,id_espacio,id_pack)
    VALUES (?,?,?,?,?,?);
    `,
      [
        formatDateToDB(new Date(fecha_inicio)),
        formatDateToDB(new Date(fecha_fin)),
        totalPriceResservation,
        id_user,
        id_space,
        id_pack,
      ]
    );

    res.send({
      status: "ok",
      data: {
        fecha_pedido: formatDateToDB(new Date()),
        fecha_inicio: formatDateToDB(new Date(fecha_inicio)),
        fecha_fin: formatDateToDB(new Date(fecha_fin)),
        precio_pedido: totalPriceResservation,
        id_usuario: id_user,
        id_espacio: id_space,
        id_pack: id_pack,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = newReservation;
