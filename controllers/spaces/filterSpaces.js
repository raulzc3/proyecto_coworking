const { formatDateToDB, validator } = require("../../helpers");
const { filterSpaceSchema } = require("../../schemas");
const filterSpaces = async (req, res, next) => {
  let connection;
  try {
    connection = await req.app.locals.getDB();

    //      Valido datos del body
    //      Quiero: idEspacio,typeEspacio,nombreEspacio,price,capacity,,,mediascores,fotos
    await validator(filterSpaceSchema, req.body);
    //    Saco la propiedad id de los parámetros de ruta
    let {
      type,
      price,
      score,
      capacity,
      start_date,
      end_date,
      order,
      direction,
    } = req.query;

    const orderBy = order ? order : "score";
    const orderDirection = direction ? direction : "ASC";

    let results;

    if (start_date && end_date) {
      start_date = formatDateToDB(new Date(start_date));
      end_date = formatDateToDB(new Date(end_date));
    }

    [results] = await connection.query(
      `

          SELECT * 
          FROM spaces s JOIN photos p ON s.id = p.space_id
          WHERE s.id NOT IN (
          SELECT DISTINCT space_id 
          FROM orders
           WHERE (? BETWEEN start_date AND end_date) 
           or (? BETWEEN start_date AND end_date)
           or (? < start_date  AND ? > end_date)
           )
           AND s.id NOT IN (
            SELECT DISTINCT space_id
            FROM reviews
            GROUP BY space_id
            HAVING AVG(score)<?
           ) AND (s.price <= ? OR ?) 
           AND (s.type LIKE ? OR ?) 
           AND (s.capacity >=? OR ?) 
           ORDER BY "${orderBy}", "${orderDirection}";`,
      [
        start_date,
        end_date,
        start_date,
        end_date,
        score,
        price,
        !price,
        type,
        !type,
        capacity,
        !capacity,
      ]
    );

    res.send({
      status: "ok",
      data: {
        ...results,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = filterSpaces;
