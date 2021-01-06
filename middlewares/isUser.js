const getDB = require("../db");
const jwt = require("jsonwebtoken");

const isUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { authorization } = req.headers;

    // TODO: la cabeceira de autorización puede tener otro formato (Bearer)

    // Si no authorization está vacío devuelvo un error
    if (!authorization) {
      const error = new Error("Falta la cabecera de autorización");
      error.httpStatus = 401;
      throw error;
    }

    // Valido el token y si no es válido devuelvo un error
    let tokenInfo;
    try {
      tokenInfo = jwt.verify(authorization, process.env.SECRET);
    } catch (e) {
      const error = new Error("El token no es válido");
      error.httpStatus = 401;
      throw error;
    }

    // Selecciono la fecha de ultima actualización de email / password del usuario
    const [result] = await connection.query(
      `
      SELECT lastAuthUpdate
      FROM users
      WHERE id=?
    `,
      [tokenInfo.id]
    );

    const lastAuthUpdate = new Date(result[0].lastAuthUpdate);
    const tokenEmissionDate = new Date(tokenInfo.iat * 1000);

    if (tokenEmissionDate < lastAuthUpdate) {
      const error = new Error("El token no es válido");
      error.httpStatus = 401;
      throw error;
    }

    // Inyectamos en la request la información del token
    req.userAuth = tokenInfo;
    // req.userAuth = { id: 12, role: 'normal', iat: 1608572656, exp: 1611164656 }; // por ejemplo

    // Continúo
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = isUser;
