const getDB = require("../../db");

const getReservation = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    res.send({
      status: "ok",
      message: "crear reserva",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = getReservation;
