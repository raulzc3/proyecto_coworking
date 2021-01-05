const getDB = require("../db");
const { createError } = require("../helpers");
const reservationExists = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { reservation_id } = req.params;

    //comprobar que hay id de reserva
    console.log("esto es :", reservation_id);
    const [bookings] = await connection.query(
      `
      SELECT ID FROM orders WHERE ID=?
    `,
      [reservation_id]
    );

    if (bookings.length === 0) {
      throw createError("Esta reserva no existe", 404);
    }

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = reservationExists;
