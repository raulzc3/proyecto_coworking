const getReservation = async (req, res, next) => {
  let connection;
  let reservation = [];
  try {
    connection = await req.app.locals.getDB();
    const { user_id } = req.params;
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
           SELECT * FROM orders WHERE user_id = ? AND (DATE(?) BETWEEN start_date AND end_date) ORDER BY ID;`,
          [user_id, new Date()]
        );
        break;

      case "pending":
        orders = await connection.query(
          `
             SELECT * FROM orders WHERE user_id = ? AND DATE(?) < start_date ORDER BY ID;`,
          [user_id, new Date()]
        );
        break;
      case "finished":
        orders = await connection.query(
          `
               SELECT * FROM orders WHERE user_id = ? AND DATE(?) > end_date ORDER BY ID ;`,
          [user_id, new Date()]
        );
        break;
      default:
        orders = await connection.query(
          `SELECT * FROM orders WHERE user_id = ?;`,
          [user_id]
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
