const { format } = require("date-fns");
const sharp = require("sharp");
const uuid = require("uuid");
const path = require("path");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");

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

async function sendMail({ to, subject, body }) {
  // Instrucciones: https://www.npmjs.com/package/@sendgrid/mail
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM, // Use the email address or domain you verified above
      subject,
      text: body,
      html: `
        <div>
          <h1>${subject}</h1>
          <p>${body}</p>
        </div>
      `,
    };

    await sgMail.send(msg);
  } catch (error) {
    throw new Error("Error enviando mail");
  }
}
function createError(message, numHttpStatus) {
  const error = new Error(message);
  error.httpStatus = numHttpStatus;
  return error;
}

module.exports = {
  formatDateToDB,
  savePhoto,
  deletePhoto,
  generateRandomString,
  sendMail,
  createError,
};