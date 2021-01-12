const getReservation = async (req, res, next) => {
  let connection;
  let reservation = [];
  try {
    connection = await req.app.locals.getDB();
    const { user_id } = req.params;
    const { type } = req.query;
    const validFieldsOfType = ["current", "pending", "finished"];
    const typeOfReservation = validFieldsOfType.includes(type) ? type : " ";

    // si el id de usuario no existe dar error --> middleware userExists ✅

    //si existe se enlistan las reservas hechas según el fintro indicado ✅
    let orders;

    switch (typeOfReservation) {
      case "current":
        orders = await connection.query(
          `
           SELECT * FROM orders WHERE user_id = ? AND (CURDATE() BETWEEN start_date AND end_date) ORDER BY start_date, end_date , order_Date;`,
          [user_id]
        );
        break;

      case "pending":
        orders = await connection.query(
          `
             SELECT * FROM orders WHERE user_id = ? AND CURDATE() < start_date ORDER BY start_date , end_date , order_Date;`,
          [user_id]
        );
        break;
      case "finished":
        orders = await connection.query(
          `
               SELECT * FROM orders WHERE user_id = ? AND CURDATE()  > end_date ORDER BY start_date, end_date , order_Date;`,
          [user_id]
        );
        break;
      default:
        orders = await connection.query(
          `SELECT * FROM orders WHERE user_id = ? ORDER BY start_date;`,
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
