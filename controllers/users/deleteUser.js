const getDB = require("../../db");
const { generateRandomString } = require("../../helpers");
const { CreateError } = require("../../helpers");

const deleteUser = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    // Sacamos de req.params el id de usuario que queremos anonimizar
    const { id } = req.params;

    // Si la id es igual a 1 deberíamos dar un error
    if (Number(id) === 1) {
      await CreateError(
        "El administrador principal no se puede anonimizar",
        403
      );
    }

    // Si el usuario solicitado coíncide con el del token se muestran los datos --> middleware isAuthorized ✅

    // Hacemos un update de la tabla de usuarios
    // cambiar el mail, cambiar la password, borrar el nombre, borrar el avatar, marcar como no activo, marcar como si borrado
    await connection.query(
      `
      UPDATE users
      SET password=?, name="[borrado]", avatar=NULL, active=0, deleted=1, lastAuthUpdate=?
      WHERE id=?
    `,
      [generateRandomString(40), new Date(), id]
    );

    // Devolvemos respuesta
    res.send({
      status: "ok",
      message: `El usuario con id: ${id} fue anonimizado`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteUser;
