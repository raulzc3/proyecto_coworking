const getDB = require("../../db");

const getUser = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    // Saco la id de usuario de req.params
    const { user_id } = req.params;

    // Saco toda la información de usuario
    const [user] = await connection.query(
      `
      SELECT ID,name, surname,nif,photo,email, tel,registration_date, company, admin
      FROM users 
      WHERE ID=?
    `,
      [user_id]
    );
    console.log(user[0]);
    // // Creo la respuesta básica

    const userInfo = {
      name: user[0].name,
      surname: user[0].surname,
      nif: user[0].nif,
      photo: user[0].photo,
      email: user[0].email,
      tel: user[0].tel,
      registration_date: user[0].registration_date,
      company: user[0].company,
      admin: user[0].admin,
    };
    console.log(userInfo);

    // // Si el usuario solicitado coíncide con el del token añado a la respuesta básica los datos privados
    // if (user[0].id === req.userAuth.id || req.userAuth.role === "admin") {
    //   userInfo.date = user[0].date;
    //   userInfo.email = user[0].email;
    //   userInfo.role = user[0].role;
    // }

    // Devuelvo la respuesta
    res.send({
      status: "ok",
      data: userInfo,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = getUser;
