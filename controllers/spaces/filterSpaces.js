const getDB = require("../../db");

const filterSpaces = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    //      Quiero: idEspacio,typeEspacio,nombreEspacio,price,capacity,,,mediascores,fotos

    //    Saco la propiedad id de los parámetros de ruta
    let {type, price, score, capacity, order, direction } = req.query;

    const validOrderFields = ["type", "price", "score", "capacity"];
    const validOrderDirection = ["DESC", "ASC"];

    const orderBy = validOrderFields.includes(order) ? order : "score";
    const orderDirection = validOrderDirection.includes(direction)
      ? direction
      : "ASC";

    let results;

    if (capacity ||type || price || score) {
      [results] = await connection.query(
        `
    SELECT DISTINCT e.ID, e.type, e.name, e.price,e.capacity,AVG(IFNULL(v.score,0)) AS calificacion, f.url,e.description 
    FROM spaces e LEFT JOIN reviews v ON (e.ID=v.space_id)
    LEFT JOIN photos f ON (e.ID=f.space_id)
    GROUP BY e.ID, f.url
    HAVING (e.price <= ? OR ?) AND (score >=? OR ?) AND (e.type LIKE ? OR ?) AND (e.capacity >=? OR ?)
    ORDER BY "${orderBy}", "${orderDirection}";
    `,
        [
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
  SELECT e.ID, e.type, e.name, e.price,e.capacity,AVG(IFNULL(v.score,0)) AS calificacion, f.url,e.description 
  FROM spaces e LEFT JOIN reviews v ON (e.ID=v.space_id)
  LEFT JOIN photos f ON (e.ID=f.space_id)
  GROUP BY e.ID, f.url
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
