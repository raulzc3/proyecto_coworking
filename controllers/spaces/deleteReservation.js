const getDB = require("../../db");

const deleteReservation = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    const { id_user, id_reservation } = req.params;

    // si el id de usuario no existe dar error --> middleware userExists ✅
    //si el id de espacio no existe dar error --> middleware spaceExists ✅
    //conprobar que el usuario de la reserva coincide con el usuario que desea eliminar la reserva [PENDIENTE]
    const bookings = await connection.query(
      `DELETE FROM pedidos WHERE ID = ?`,
      [id_reservation]
    );
    console.log(bookings[0][0]);
    res.send({
      status: "ok",
      message: `Reserva  con ID ${id_reservation} ha sido eliminada`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = deleteReservation;
