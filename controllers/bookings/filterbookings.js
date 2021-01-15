const { validator, capitalize } = require("../../helpers");
const { filterBookingsSchema } = require("../../schemas");

const filterbookings = async (req, res, next) => {
  let connection;

  try {
    connection = await req.app.locals.getDB();

    let {
      reservation_id,
      space_id,
      space_type,
      space_name,
      user_id,
      user_full_name,
      pack,
      start_date,
      end_date,
      order_date,
      orderDirection,
      orderBy,
    } = req.query;

    //Modificamos algunos campos para que no den problemas a la hora de validarlos
    orderBy = orderBy ? orderBy.toLowerCase() : "id";
    orderDirection = orderDirection ? orderDirection.toUpperCase() : "ASC";
    if (space_type) space_type = capitalize(space_type);
    if (pack) pack = capitalize(pack);
    // if (category) category = category.toLowerCase();
    // if (orderBy) orderBy = orderBy.toLowerCase();
    // orderBy = orderBy ? orderBy.toLowerCase() : "report_date";
    // orderDirection = orderDirection ? orderDirection.toUpperCase() : "ASC";

    await validator(filterBookingsSchema, {
      reservation_id,
      space_id,
      space_type,
      space_name,
      user_id,
      user_full_name,
      pack,
      start_date,
      end_date,
      order_date,
      orderDirection,
      orderBy,
    });

    const results = await connection.query(
      `
        SELECT o.id as "id",s.type as "space_type",s.name as "space_name",s.id as "space_id",
              CONCAT(u.name," ",u.surname) as "full_name_user",o.user_id as "user_id", p.type as "pack", 
              o.start_date as "start_date",o.end_date as "end_date",o.order_date as "order_date"
        FROM orders o 
        JOIN users u ON o.user_id = u.id 
        JOIN spaces s ON o.space_id = s.id 
        JOIN packs p ON o.pack_id = p.id
        WHERE (o.id = ? OR ?) 
                AND (s.type = ? OR ?)
                AND (s.name  = ? OR ?) 
                AND (s.id = ? OR ?)
                AND (CONCAT(u.name," ",u.surname) LIKE ? OR ?) 
                AND (o.user_id = ? OR ?) 
                AND (p.type = ? OR ?) 
                AND (DATE(o.start_date) = DATE(?) OR ?) 
                AND (DATE(o.end_date) = DATE(?) OR ?) 
                AND (DATE(o.order_date) = DATE(?) OR ?) 
          ORDER BY ${orderBy} ${orderDirection};
    `,
      [
        reservation_id,
        !reservation_id,
        space_type,
        !space_type,
        space_name,
        !space_name,
        space_id,
        !space_id,
        `%${user_full_name}%`,
        !user_full_name,
        user_id,
        !user_id,
        pack,
        !pack,
        start_date,
        !start_date,
        end_date,
        !end_date,
        order_date,
        !order_date,
      ]
    );
    const filteredBookings = results[0];
    res.send({
      status: "ok",
      data: {
        ...filteredBookings,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = filterbookings;