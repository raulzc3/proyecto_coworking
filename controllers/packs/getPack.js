const getDB = require("../../db");

const getPack = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    //      Hago el SELECT en la bd
    const [result] = await connection.query(
      `
      SELECT ID,tipo,texto_contenido,precio,foto FROM packs
      GROUP BY ID;`
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
  }
};

module.exports = getPack;
