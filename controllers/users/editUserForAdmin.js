const getDB = require("../../db");
const {
  savePhoto,
  generateRandomString,
  sendMail,
  createError,
} = require("../../helpers");

const editUserForAdmin = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();
    //nombre, nif, apellidos, empresa, telefono, email
    // Cosas que podemos editar: email, nombre, avatar
    // Sacar id de req.params
    const { user_id } = req.params; // este es el id de usuario que queremos editar
    console.log(req.params);
    console.log(req.body);
    // Sacar name y email de req.body
    const { name, surname, nif, company, tel, email } = req.body;
    // Si el usuario solicitado coíncide con el del token se muestran los datos --> middleware isAuthorized ✅

    // Sacar la información actual del usuario en la base de datos
    const [currentUserInfo] = await connection.query(
      `
      SELECT name, surname,nif, company,tel,email
      FROM users
      WHERE id=?
      `,
      [user_id]
    );
    console.log(currentUserInfo[0]);
    if (req.files && req.files.photo) {
      // Se está subiendo un photo
      const userPhoto = await savePhoto(req.files.photo, "users");
      console.log(userPhoto);
      await connection.query(
        `
        UPDATE users
        SET photo=?
        WHERE id=?
        `,
        [userPhoto, user_id]
      );
    }

    // Si el email enviado es diferente al de la base de datos procesar el nuevo email
    if (email && email !== currentUserInfo[0].email) {
      // Comprobar que no exista otro usuario con el nuevo email
      const [existingEmail] = await connection.query(
        `
        SELECT id
        FROM users
        WHERE email=?
        `,
        [email]
      );

      if (existingEmail.length > 0) {
        throw createError(
          "Ya existe un usuario con el email proporcionado en la base de datos",
          409
        );
      }

      // Creo un código de registro (contraseña temporal de un solo uso)
      const registrationCode = generateRandomString(40);

      // Mando un mail al usuario con el link de confirmación de email
      const emailBody = `

    Acabas de modificar tu email de registro en <strong>COWORKIT</strong>.
    Pulsa en este link para validar tu nuevo email: <strong>. ${process.env.PUBLIC_HOST}/users/validate/${registrationCode}</strong>.
      `;

      await sendMail({
        to: email,
        subject: `Valida tu nuevo email para continuar con sinergia en COWORKIT`,
        body: emailBody,
        name,
        introMessage: "Hola",
      });

      // Actualizar el resto de los datos
      //name, surname, nif, company, tel, email
      await connection.query(
        `
      UPDATE users
      SET name=?,surname=?, nif=?,company=?, tel=?, email=?, last_auth_date=?, verified=0, validation_code=?
      WHERE id=?
      `,
        [
          name,
          surname,
          nif,
          company,
          tel,
          email,
          new Date(),
          registrationCode,
          user_id,
        ]
      );

      // Dar una respuesta
      res.send({
        status: "ok",
        message:
          "Datos de usuario actualizados. Mira tu email para validar la nueva dirección",
      });
    } else {
      await connection.query(
        `
        UPDATE users
        SET name=?,surname=?, nif=?,company=?, tel=?
        WHERE id=?
        `,
        [name, surname, nif, company, tel]
      );

      res.send({
        status: "ok",
        message: "Datos de usuario actualizados",
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editUserForAdmin;
