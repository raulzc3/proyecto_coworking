const { format } = require("date-fns");
const sharp = require("sharp");
const uuid = require("uuid");
const path = require("path");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
const Joi = require("joi");
require("dotenv").config();

const { ensureDir, unlink } = require("fs-extra");

const { UPLOADS_DIRECTORY } = process.env;
const uploadsDir = path.join(__dirname, UPLOADS_DIRECTORY);

// Configuro sendgrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Formatea un objeto de fecha a DATETIME de SQL
function formatDateToDB(dateObject) {
  return format(dateObject, "yyyy-MM-dd HH:mm:ss");
}

// Borra un fichero en el directorio de uploads
async function deletePhoto(photo, folder) {
  folder = folder === undefined ? "" : folder;
  const photoPath = path.join(uploadsDir, folder, photo);

  await unlink(photoPath);
}

// Guarda una foto en el directorio de uploads o un directorio que se indique dentro de uploads
async function savePhoto(imageData, folder, width) {
  // imageData es el objeto con información de la imagen

  // Asignamos valores por defecto en caso de que no se introduzcan los parámetros folder o width
  folder = folder === undefined ? "" : folder;
  width = width === undefined ? 1000 : width;

  const photoDir = path.join(uploadsDir, folder);
  // Asegurarse que el directorio de subida de imagenes exista
  await ensureDir(photoDir);

  // Leer la imagen con sharp
  const image = sharp(imageData.data);

  // Comprobar que la imagen no tenga un tamaño mayor a X pixeles de ancho
  const imageInfo = await image.metadata();

  // Si es mayor que ese tamaño redimensionarla a ese tamaño
  const IMAGE_MAX_WIDTH = width;
  if (imageInfo.width > IMAGE_MAX_WIDTH) {
    image.resize(IMAGE_MAX_WIDTH);
  }

  // Generar un nombre único para la imagen
  const savedImageName = `${uuid.v4()}.jpg`;

  // Guardar la imagen en el directorio de subida de imagenes
  await image.toFile(path.join(photoDir, savedImageName));

  // Devolver en nombre del fichero
  return savedImageName;
}

// Genera una cadena de caracteres aleatoria
function generateRandomString(length) {
  return crypto.randomBytes(length).toString("hex");
}

async function sendMail({ to, subject, body, name, introMessage }) {
  // Instrucciones: https://www.npmjs.com/package/@sendgrid/mail
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM, // Use the email address or domain you verified above
      subject,
      text: body,
      html: `
      <h1>${introMessage} ${name}</h1>
        <div>
          <h2>${subject}</h2>
          <p>${body}</p>
          <br>
          <strong><i><u>Coworkit</u> "Let's synergy <u>together</u>"</i></strong>
        </div>
        

      `,
    };

    await sgMail.send(msg);
  } catch (error) {
    throw new Error("Error enviando mail");
  }
}

// Devuelve un error con un mensaje y un codigo de error
function createError(message, numHttpStatus) {
  const error = new Error(message);
  error.httpStatus = numHttpStatus;
  return error;
}

//Comprueba que el id introducido como parámetro es un número
function isId(id) {
  const schema = Joi.number().required().integer().positive();
  const validation = schema.validate(id);

  if (validation.error) {
    throw createError(
      "El valor introducido no se corresponde con el formato de un ID",
      400
    );
  } else {
    return id;
  }
}
function dateValidator(startDateOrder) {
  if (new Date().getTime() > startDateOrder.getTime()) {
    return false;
  } else {
    return true;
  }
}
async function validator(schema, valueToValidate) {
  try {
    await schema.validateAsync(valueToValidate);
  } catch (error) {
    error.httpStatus = 400;
    throw error;
  }
}

//Devuelve la cadena introducida con la primera letra en mayúscula y el resto en minúscula
function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

//Aplica la función capitalize a todas las palabras separadas con espacios
function formatName(firstName) {
  firstName = firstName.toLowerCase().split(" ");
  let formatedName;

  for (let i = 0; i < firstName.length; i++) {
    if (i === 0) {
      formatedName = capitalize(firstName[i]);
    } else {
      formatedName += ` ${capitalize(firstName[i])}`;
    }
  }

  return formatedName;
}

module.exports = {
  formatDateToDB,
  savePhoto,
  deletePhoto,
  generateRandomString,
  sendMail,
  createError,
  isId,
  dateValidator,
  validator,
  capitalize,
  formatName,
};
