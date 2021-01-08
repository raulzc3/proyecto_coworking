const getDB = require("../../db");

const getSpace = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    //      Quiero: idEspacio, tipoEspacio,nameEspacio,price,aforo,,,mediaValoraciones,fotos

    //    Saco la propiedad id de los parámetros de ruta
    const { space_id } = req.params;

    //      Hago el SELECT en la bd
    const [result] = await connection.query(
      `
    SELECT DISTINCT e.ID, e.type, e.name, e.price,e.capacity,AVG(IFNULL(v.score,0)) AS score, f.url,e.description 
    FROM spaces e LEFT JOIN reviews v ON (e.ID=v.space_id)
    LEFT JOIN photos f ON (e.ID=f.space_id)
    WHERE e.ID=?
    GROUP BY e.ID,f.url
    
    ;`,
      [space_id]
    );

    console.log(result);
    res.send({
      status: "ok",
      data: {
        ...result,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = getSpace;
