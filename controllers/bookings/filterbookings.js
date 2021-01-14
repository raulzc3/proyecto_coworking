const { validator } = require("../../helpers");
const { filterReportSchema } = require("../../schemas");

const filterbookings = async (req, res, next) => {
  let connection;

  try {
    connection = await req.app.locals.getDB();

    const {
      reservation_id,
      space,
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
    // if (category) category = category.toLowerCase();
    // if (orderBy) orderBy = orderBy.toLowerCase();
    // orderBy = orderBy ? orderBy.toLowerCase() : "report_date";
    // orderDirection = orderDirection ? orderDirection.toUpperCase() : "ASC";

    // await validator(filterReportSchema, {
    //   report_id,
    //   user,
    //   space,
    //   category,
    //   date,
    //   solved,
    //   orderBy,
    //   orderDirection,
    // });

    const results = await connection.query(
      `
        SELECT o.id as "id", CONCAT(u.name," ",u.surname) "full_name_user", s.type as "space", p.type as "pack", o.start_date as "start_date",o.end_date as "end_date",o.order_date as "order_date"
        FROM orders o JOIN users u ON o.user_id = u.id JOIN spaces s ON o.space_id = s.id JOIN packs p ON o.pack_id = p.id
        WHERE (o.id = ? OR ?) 
                AND (s.name = ? OR ?)
                AND (o.user_id = ? OR ?) 
                AND (CONCAT(u.name," ",u.surname) LIKE ? OR ?) 
                AND (p.type = ? OR ?) 
                AND (DATE(o.start_date) = DATE(?) OR ?) 
                AND (DATE(o.end_date) = DATE(?) OR ?) 
                AND (DATE(o.order_date) = DATE(?) OR ?) 
          ORDER BY ${orderBy} ${orderDirection};
    `,
      [
        reservation_id,
        !reservation_id,
        space,
        !space,
        user_id,
        !user_id,
        `%${user_full_name}%`,
        !user_full_name,
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
    console.log(results[0]);
    // res.send({
    //   status: "ok",
    //   data: {
    //     ...results,
    //   },
    // });
    res.send({
      status: "ok",
      data: "filtrado",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = filterbookings;
