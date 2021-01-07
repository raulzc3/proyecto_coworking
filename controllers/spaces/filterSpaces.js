const getDB = require("../../db");
const { formatDateToDB } = require("../../helpers");

const filterSpaces = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    //      Quiero: idEspacio,typeEspacio,nombreEspacio,price,capacity,,,mediascores,fotos

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

    const validOrderFields = [
      "type",
      "price",
      "score",
      "capacity",
      start_date,
      end_date,
    ];
    const validOrderDirection = ["DESC", "ASC"];

    const orderBy = validOrderFields.includes(order) ? order : "score";
    const orderDirection = validOrderDirection.includes(direction)
      ? direction
      : "ASC";

    let results;
    let date = true;

    if (start_date && end_date) {
      date = false;
      start_date = formatDateToDB(new Date(start_date));
      end_date = formatDateToDB(new Date(end_date));
    }

    if (capacity || type || price || score || (start_date && end_date)) {
      [results] = await connection.query(
        `
    SELECT DISTINCT e.ID, e.type, e.name, e.price,e.capacity,AVG(IFNULL(r.score,0)) AS score, o.space_id,
    f.url,e.description
    FROM spaces e LEFT JOIN reviews r ON (e.ID=r.space_id)
    LEFT JOIN photos f ON (e.ID=f.space_id)
    LEFT JOIN orders o ON(e.ID=o.space_id)
    WHERE ((DATE(o.start_date)<DATE(?) AND (DATE(o.end_date)<DATE(?)) OR ?) OR
    ((DATE(o.start_date)>DATE(?) AND DATE(o.end_date)>DATE(?)) OR ?))
    GROUP BY e.ID, f.url
    HAVING (e.price <= ? OR ?) AND (score >=? OR ?) AND (e.type LIKE ? OR ?) AND (e.capacity >=? OR ?) 
      ORDER BY "${orderBy}", "${orderDirection}";
    `,
        [
          start_date,
          start_date,
          date,
          end_date,
          end_date,
          date,
          price,
          !price,
          score,
          !score,
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
