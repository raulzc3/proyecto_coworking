const getDB = require("../../db");
const {
  generateRandomString,
  sendMail,
  createError,
} = require("../../helpers");

const addUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Recojo de req.body el email y la password
    const { name, surname, nif, email, password } = req.body;

    // Compruebo que no estén vacíos

    if (!name || !surname || !nif || !email || !password) {
      throw createError("Faltan campos", 400);
    }

    // Compruebo que no exista un usuario en la base de datos con ese email

    const [existingUser] = await connection.query(
      ` 
    SELECT ID FROM users WHERE email=? OR  nif= ?`,
      [email, nif]
    );

    if (existingUser.length > 0) {
      throw createError(
        "Ya hay un usuario en la base de datos con ese email o NIF",
        409
      );
    }

    // Creo un código de registro (contraseña temporal de un solo uso)
    const registrationCode = generateRandomString(40);

    // Mando un mail al usuario con el link de confirmación de email
    const emailBody = `

    Te acabas de registra en la empresa de espacios de trabajo <strong>COWORKIT</strong>. 
    Pulsa en este link para validar tu email: <strong>. ${process.env.PUBLIC_HOST}/users/validate/${registrationCode}</strong>. 
      `;

    await sendMail({
      to: email,
      subject: `Activa tu usuario para empezar a hacer sinergia en COWORKIT`,
      body: emailBody,
      name,
    });

    // Meto el usuario en la base de datos desactivado y con ese código de registro
    await connection.query(
      `
      INSERT INTO users(name, surname, nif, email, password, validation_code )
      VALUES(?,?,?,?,SHA2(?, 512),?)
      `,
      [name, surname, nif, email, password, registrationCode]
    );

    // Mando una respuesta
    res.send({
      status: "ok",
      message: "Usuario registrado, comprueba tu email para activarlo",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = addUser;
