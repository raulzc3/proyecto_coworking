const getDB = require("../../db");

const filterSpaces = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    //      Quiero: idEspacio, tipoEspacio,nombreEspacio,precio,aforo,,,mediaValoraciones,fotos

    //    Saco la propiedad id de los parámetros de ruta
    const { tipo, precio, calificacion, aforo, order, direction } = req.query;

    let newTipo = tipo === undefined ? "true" : `e.tipo LIKE '%${tipo}%'`;

    const validOrderFields = ["tipo", "precio", "calificacion", "aforo"];
    const validOrderDirection = ["DESC", "ASC"];

    const orderBy = validOrderFields.includes(order) ? order : "calificacion";
    const orderDirection = validOrderDirection.includes(direction)
      ? direction
      : "ASC";

    let results;
    if (tipo || precio || calificacion || aforo) {
      [results] = await connection.query(
        `
    SELECT e.ID, e.tipo, e.nombre, e.precio,e.aforo,AVG(IFNULL(v.calificacion,0)) AS calificacion, f.url 
    FROM espacios e LEFT JOIN valoraciones v ON (e.ID=v.id_espacio)
    LEFT JOIN fotos f ON (e.ID=f.id_e spacio)
    WHERE ? OR e.precio LIKE ?  OR v.calificacion LIKE ? OR e.aforo >= ?
    GROUP BY e.ID, f.url,v.calificacion
    ORDER BY "${orderBy}" "${orderDirection}";
    `,
        [newTipo, `%${precio}%`, `%${calificacion}%`, `%${aforo}%`]
      );
    } else {
      [results] = await connection.query(`
  SELECT e.ID, e.tipo, e.nombre, e.precio,e.aforo,AVG(IFNULL(v.calificacion,0)) AS calificacion, f.url 
  FROM espacios e LEFT JOIN valoraciones v ON (e.ID=v.id_espacio)
  LEFT JOIN fotos f ON (e.ID=f.id_espacio)
  GROUP BY e.ID, f.url
  ORDER BY "${orderBy}", "${orderDirection}";`);
    }

    const [single] = results;
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
