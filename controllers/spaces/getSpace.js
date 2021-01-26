const getSpace = async (req, res, next) => {
  let connection;
  try {
    connection = await req.app.locals.getDB();

    //      Quiero: idEspacio, tipoEspacio,nameEspacio,price,aforo,,,mediaValoraciones,fotos

    //    Saco la propiedad id de los parámetros de ruta
    const { space_id } = req.params;

    //      Hago el SELECT en la bd
    const [result] = await connection.query(
      `
    SELECT DISTINCT e.ID, e.type, e.name, e.price,e.capacity,AVG(IFNULL(v.score,0)) AS score,e.description 
    FROM spaces e LEFT JOIN reviews v ON (e.ID=v.space_id)
    WHERE e.ID=? AND e.enabled=1
    GROUP BY e.ID
    
    ;`,
      [space_id]
    );

    const [
      photos,
    ] = await connection.query(`SELECT url FROM photos WHERE space_id=?;`, [
      space_id,
    ]);

    res.send({
      status: "ok",
      data: {
        ...result,
      },
      photos: { ...photos },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = getSpace;

/**
 * 
 *     SELECT DISTINCT e.ID, e.type, e.name, e.price,v.comment,e.capacity,AVG(IFNULL(v.score,0)) AS score, f.url,e.description 
    FROM spaces e LEFT JOIN reviews v ON (e.ID=v.space_id)
    LEFT JOIN photos f ON (e.ID=f.space_id)
    WHERE e.ID=2
    GROUP BY e.ID,f.url,v.space_id;
    
 */
