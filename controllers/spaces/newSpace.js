const getDB = require("../../db");
const {createError}=require("../../helpers");

const newSpace = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { type, description, name, price, capacity } = req.body;
    if (!type || !description || !name || !price || !capacity) {
      throw await createError("Faltan campos", 400);
    }

    typeArray = [
      "Sala de reuniones",
      "Oficina individual",
      "Auditorio",
      "Sala audiovisual",
      "Oficina compartida",
    ];

    if (
      !typeArray.includes(type) ||
      description.length > 60000 ||
      name.length > 50 ||
      price <= 0 ||
      capacity <= 0
    ) {
      throw await createError("Datos incorrectos", 400);
    }
    //  Introduzco los nuevos datos
    const [result] = await connection.query(
      `
        INSERT INTO spaces (type,description,name, price, capacity)
        VALUES (?,?,?,?,?);
        `,[type, description, name, price, capacity]);

    //obtengo la id autogenerada
    const { insertId } = result;

    //Envio la respuesta
    res.send({
      status: "ok",
      insertId,
      type,
      description,
      name,
      price,
      capacity,
    });
  } catch (error) {
    next(error);
  }finally{
      if (connection) connection.release();
  }
};
module.exports=newSpace;