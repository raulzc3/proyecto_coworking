const getDB = require("../../db");
const {newSpaceSchema}=require("../../schemas")
const editSpace = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();
    const { space_id } = req.params;


    
    //validar los valores del body ✅
    await validator(newSpaceSchema, req.body);

    const { type, description, name, price, capacity } = req.body;

    //hago un query de SQL Update para editar los datos
    await connection.query(
      `
    UPDATE spaces SET type=?,description=?,name=?,price=?,capacity=?
    WHERE ID=?
    ;`,
      [type, description, name, price, capacity, space_id]
    );

    res.send({
      status: "ok",
      data: {
        space_id,
        type,
        description,
        name,
        price,
        capacity,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = editSpace;
