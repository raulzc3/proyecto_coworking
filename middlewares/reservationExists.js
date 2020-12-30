const getDB = require("../db");
const { createError } = require("../helpers");
const reservationExists = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id_reservation } = req.params;

    const [bookings] = await connection.query(
      `
      SELECT id FROM pedidos WHERE ID=?
    `,
      [id_reservation]
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
