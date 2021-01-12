const deleteReservation = async (req, res, next) => {
  let connection;
  try {
    connection = await req.app.locals.getDB();
    const { user_id, reservation_id } = req.params;

    // si el id de usuario no existe dar error --> middleware userExists ✅
    //si el id de espacio no existe dar error --> middleware spaceExists ✅
    //conprobar que el usuario de la reserva coincide con el usuario que desea eliminar la reserva [PENDIENTE]
    const bookings = await connection.query(`DELETE FROM orders WHERE ID = ?`, [
      reservation_id,
    ]);
    res.send({
      status: "ok",
      message: `Reserva  con ID ${reservation_id} ha sido eliminada`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = deleteReservation;
