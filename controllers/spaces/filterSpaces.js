const getDB = require("../../db");
const { formatDateToDB, validator } = require("../../helpers");
const { filterSpaceSchema } = require("../../schemas");
const filterSpaces = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

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


    const orderBy = validOrderFields.includes(order) ? order : "score";
    const orderDirection = validOrderDirection.includes(direction)
      ? direction
      : "ASC";

    let results;

    if (start_date && end_date) {
      start_date = formatDateToDB(new Date(start_date));
      end_date = formatDateToDB(new Date(end_date));
    }

    if (capacity || type || price || score || (start_date && end_date)) {
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
    } else {
      [results] = await connection.query(`
  SELECT e.ID, e.type, e.name, e.price,e.capacity,AVG(IFNULL(r.score,0)) AS calificacion, f.url,e.description 
  FROM spaces e LEFT JOIN reviews r ON (e.ID=r.space_id)
  LEFT JOIN photos f ON (e.ID=f.space_id)
  GROUP BY e.ID, f.url,r.space_id
  ORDER BY "${orderBy}", "${orderDirection}";`);
    }
    console.log(results);
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
