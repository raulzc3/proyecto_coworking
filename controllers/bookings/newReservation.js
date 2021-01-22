const {
  formatDateToDB,
  createError,
  dateValidator,
  validator,
} = require("../../helpers");
const { reservationSchema } = require("../../schemas");

const newReservation = async (req, res, next) => {
  let connection;
  try {
    connection = await req.app.locals.getDB();
    const { user_id, space_id } = req.params;
    const { start_date, end_date, pack_id } = req.body;
    console.log("espacio", space_id);

    //validar los valores del body ✅
    await validator(reservationSchema, req.body);

    // si el id de usuario no existe dar error --> middleware userExists ✅

    //si el id de espacio no existe dar error --> middleware spaceExists ✅

    //la fecha de inicio no puede ser posterior a la fecha actual ✅
    if (!dateValidator(new Date(start_date)))
      throw createError("La fecha inicial debe ser posterior a la actual", 400);

    // si la fecha de inicio es posterio a la de fin dar un error ✅

    if (new Date(start_date) > new Date(end_date)) {
      throw createError("La fecha de fin debe ser posterior a la inicial", 400);
    }
    // si el espacio está ocupado en las mismas fechas dar error

    const bookingOfSpace = await connection.query(
      `
      SELECT * FROM orders WHERE (((DATE(?) BETWEEN start_date AND end_date) OR 
      (DATE(?) BETWEEN start_date AND end_date) ) OR
       (DATE(?) < start_date  AND DATE(?) > end_date )) AND
        space_id =?;
    `,
      [
        new Date(start_date),
        new Date(end_date),
        new Date(start_date),
        new Date(end_date),
        space_id,
      ]
    );

    if (bookingOfSpace[0].length !== 0) {
      console.log(bookingOfSpace[0]);
      throw createError("Espacio no disponible en esas fechas", 400);
    }

    //En caso de que exista hay que calcular precio y devolver la información de la reserva
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

    const numOfDays =
      Math.ceil(
        Math.abs(
          new Date(end_date).getTime() - new Date(start_date).getTime()
        ) /
          (1000 * 3600 * 24)
      ) + 1;

    const totalPriceResservation = numOfDays * (spacePricePerDay + packPrice);
    console.log(totalPriceResservation);

    await connection.query(
      `
    INSERT INTO orders (start_date, end_date,price, user_id,space_id,pack_id)
    VALUES (?,?,?,?,?,?);
    `,
      [
        new Date(start_date),
        new Date(end_date),
        totalPriceResservation,
        user_id,
        space_id,
        pack_id,
      ]
    );

    const [result] = await connection.query(
      `
    SELECT *
    FROM orders
    WHERE id = (SELECT MAX(id) FROM orders)
    `
    );

    res.send({
      status: "ok",
      data: {
        ...result[0],
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = newReservation;
