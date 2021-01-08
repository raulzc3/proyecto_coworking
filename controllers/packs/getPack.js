const getPack = async (req, res, next) => {
  let connection;
  try {
    connection = await req.app.locals.getDB();

    //      Hago el SELECT en la bd
    const [result] = await connection.query(
      `
      SELECT ID,type,content,price,photo FROM packs
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
