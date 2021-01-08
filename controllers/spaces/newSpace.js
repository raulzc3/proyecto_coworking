const getDB = require("../../db");
const { validator } = require("../../helpers");
const { newSpaceSchema } = require("../../schemas");
const newSpace = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    //validar los valores del body ✅
    await validator(newSpaceSchema, req.body);
    const { type, description, name, price, capacity } = req.body;

    //  Introduzco los nuevos datos
    const [result] = await connection.query(
      `
        INSERT INTO spaces (type,description,name, price, capacity)
        VALUES (?,?,?,?,?);
        `,
      [type, description, name, price, capacity]
    );

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
  } finally {
    if (connection) connection.release();
  }
};
module.exports = newSpace;
