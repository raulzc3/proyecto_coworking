const getDB = require("../../db");

const getSpace = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    //      Quiero: idEspacio, tipoEspacio,nombreEspacio,precio,aforo,,,mediaValoraciones,fotos

    //    Saco la propiedad id de los parámetros de ruta
    const {id}=req.params;

    //      Hago el SELECT en la bd
    const [result]=await connection.query(`
    SELECT e.ID, e.tipo, e.nombre, e.precio,e.aforo,AVG(IFNULL(v.calificacion,0)) AS calificacion, f.url 
    FROM espacios e LEFT JOIN valoraciones v ON (e.ID=v.id_espacio)
    LEFT JOIN fotos f ON (e.ID=f.id_espacio)
    WHERE e.ID=?
    GROUP BY e.ID
    
    ;`,[id])
const [single]=result;
console.log(result)
res.send({
    status:"ok",
    data:{
        ...result
    }
})


  } catch (error) {
      next(error);
  }finally{
      if (connection) connection.release();
  }
};
module.exports=getSpace;
