const getDB = require("../../db");
const { createError, deletePhoto, savePhoto } = require("../../helpers");

const editPack = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    //obtengo el id del pack a modificar del endpoint
    const { review_id } = req.params;

    //Saco los campos del body not null del body: tipo, texto_contenido,precio,foto
    const { comment,score } = req.body;
console.log(comment,score)
    //Compruebo que existen
    if (!comment || !score) {
      throw createError("Faltan campos", 400);
    }
    //Compruebo que son válidos (lo tengo que poner en joi)
    
    //if (
    //  !typeArray.includes(type) ||
    //  comment > 60000 ||
    //  score < 0||score>10
    //) {
    //  throw createError("campo inválido", 400);
    //}
    
    //Obtengo el user_id=?y space_id de la review
   const [photoQuery] = await connection.query(
        `
      SELECT user_id,space_id FROM reviews
      WHERE  ID=?`,
        [review_id]
      );
      const user_id = photoQuery[0].user_id;
      const space_id = photoQuery[0].space_id;
      
    


      
    //hago un query de SQL Update para editar los datos
    await connection.query(
      `
    UPDATE reviews SET comment=?,score=?,user_id=?,space_id=?
    WHERE ID=?
    ;`,
      [comment,score, user_id, space_id,review_id]
    );

    res.send({
      status: "ok",
      data: {
        comment,score, user_id, space_id,review_id
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editPack;
