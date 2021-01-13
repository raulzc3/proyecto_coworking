const { validator } = require("../../helpers");
const { getPackSchema } = require("../../schemas");
const getPack = async (req, res, next) => {
  let connection;
  try {
    connection = await req.app.locals.getDB();

    //Verifico los datos del query
    await validator(getPackSchema, req.query);
    const { order, direction } = req.query;
    const orderBy = order ? order : "ID";
    const orderDirection = direction ? direction : "ASC";

    //      Hago el SELECT en la bd
    const [result] = await connection.query(
      `
      SELECT ID,type,content,price,photo FROM packs
      ORDER BY ${orderBy} ${orderDirection};`
    );

    res.send({
      status: "ok",
      data: {
        ...result,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getPack;
