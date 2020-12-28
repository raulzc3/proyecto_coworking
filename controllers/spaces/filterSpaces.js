const getDB = require("../../db");

const filterSpaces = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    //      Quiero: idEspacio, tipoEspacio,nombreEspacio,precio,aforo,,,mediaValoraciones,fotos

    //    Saco la propiedad id de los parámetros de ruta
    const {search,order,direction}=req.query;
    
const validOrderFields=["type","price","capacity","calification","aforo"];
const validOrderDirection=["DESC","ASC"];

const orderBy=validOrderFields.includes(order)?order:"calification";
const orderDirection=validOrderDirection.includes(direction)?direction:"ASC";

let results;

if (search) {
  [results]=await connection.query(`

    SELECT e.ID, e.tipo, e.nombre, e.precio,e.aforo,AVG(IFNULL(v.calificacion,0)) AS calificacion, f.url 
    FROM espacios e LEFT JOIN valoraciones v ON (e.ID=v.id_espacio)
    LEFT JOIN fotos f ON (e.ID=f.id_espacio)
    WHERE e.type LIKE ? OR e.price LIKE ? OR e.capaity LIKE ? OR e.calification LIKE ? 
    GROUP BY e.ID
    ORDER BY ${orderBy} ${orderDirection};
    `,
    [`%${search}%`,`%${search}%`,`%${search}%`,`%${search}%`]);
} else {
  [results]=await connection.query(`
  SELECT e.ID, e.tipo, e.nombre, e.precio,e.aforo,AVG(IFNULL(v.calificacion,0)) AS calificacion, f.url 
  FROM espacios e LEFT JOIN valoraciones v ON (e.ID=v.id_espacio)
  LEFT JOIN fotos f ON (e.ID=f.id_espacio)
  WHERE e.ID=?
  GROUP BY e.ID
  ORDER BY ${orderBy} ${orderDirection}`);
}

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
module.exports=filterSpaces;
