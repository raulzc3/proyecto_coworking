require("dotenv").config();
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const { PORT } = process.env;
const getDB = require("./db");

// #################################################################
// #             Importamos controllers y middlewares              #
// #################################################################

//Controladores de espacios
const {
  getSpace,
  filterSpaces,
  getReservation,
  newReservation,
  deleteReservation,
  editSpace,
  deleteSpace,
  newSpace,
  editReservation,
  changeStateSpaces,
} = require("./controllers/spaces");

//Controladores de packs
const {
  newPack,
  editPack,
  deletePack,
  getPack,
} = require("./controllers/packs");

//Controladores de valoraciones
const {
  newReview,
  editReview,
  deleteReview,
  filterReviews,
} = require("./controllers/reviews");

//Controladores de reportes
const {
  newReport,
  filterReports,
  editReport,
  answerReports,
} = require("./controllers/reports");

//Controladores de usuarios
const {
  addUser,
  validateUser,
  loginUser,
  getUser,
  deleteUser,
  editUser,
  contactUser,
  recoverUserPassword,
  resetUserPassword,
  filterUsers,
  editPassword,
} = require("./controllers/users");

//Middlewares
const {
  userExists,
  spaceExists,
  reservationExists,
  reportExists,
  reviewExists,
  isAuthorized,
  packExists,
  isAdmin,
} = require("./middlewares");

// #################################################################
// #                      Configuramos express                     #
// #################################################################

// Creamos la app de express
const app = express();
// Guardamos db en el local de express
app.locals.getDB = getDB;
// Body parser (body en JSON)
app.use(bodyParser.json());
// Body parser (multipart form data <- subida de imágenes)
app.use(fileUpload());
// Logger (solo se empleará durante el desarrollo)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// #################################################################
// #                     Endpoints de espacios                     #
// #################################################################

//GET - Petición para un espacio en concreto
//URL ejemplo: http://localhost:3000/spaces/1
app.get("/spaces/:space_id", spaceExists, getSpace);

//GET - Filtrar espacios (si no se filtran, se muestran todos)
//URL ejemplo: http://localhost:3000/spaces?aforo=23
app.get("/spaces", filterSpaces);

// POST - Crear un espacio
//URL ejemplo: http://localhost:3000/spaces
app.post("/spaces", newSpace);

//PUT - Editar un espacio
//URL ejemplo: http://localhost:3000/spaces/3
app.put("/spaces/:space_id", spaceExists, editSpace);

//DELETE- Eliminar un espacio
//URL ejemplo: http://localhost:3000/spaces/11
app.delete("/spaces/:space_id", spaceExists, deleteSpace);

//GET (PUT) - Cambiar estado espacio: habilitado/inhabilitado
//URL ejemplo: http://localhost:3000//enableSpace/5
app.get("/enableSpace/:space_id", spaceExists, changeStateSpaces);

// #################################################################
// #                     Endpoints de reservas                     #
// #################################################################

//GET - Obtener reservas de un usuario concreto
//URL ejemplo: http://localhost:3000/1/bookings
app.get("/:user_id/bookings", userExists, getReservation);

//POST - Crear una reserva
//URL ejemplo: http://localhost:3000/space/1/1
app.post("/space/:space_id/:user_id", userExists, spaceExists, newReservation);

//PUT - Modificar una reserva
//URL ejemplo: http://localhost:3000/1/bookings/1
app.put(
  "/:user_id/bookings/:reservation_id",
  userExists,
  isAuthorized,
  reservationExists,
  editReservation
);

//DELETE - Eliminar una reserva
//URL ejemplo_ http://localhost:3000/1/bookings/1"
app.delete(
  "/:user_id/bookings/:reservation_id",
  userExists,
  isAuthorized,
  reservationExists,
  deleteReservation
);

// #################################################################
// #                       Endpoints de packs                      #
// #################################################################

//GET - Obtener todos los packs
//URL ejemplo: http://localhost:3000/packs
app.get("/packs", isAdmin, getPack);

//GET - Crear un pack
//URL ejemplo http://localhost:3000/packs
app.post("/packs", newPack);

//PUT - Modificar un pack
//URL ejemplo http://localhost:3000/packs/1
app.put("/packs/:pack_id", isAdmin, packExists, editPack);

//DELETE - Eliminar un pack
//URL ejemplo http://localhost:3000/packs/5
app.delete("/packs/:pack_id", isAdmin, packExists, deletePack);

// #################################################################
// #                      Endpoints de reseñas                     #
// #################################################################

//GET - Filtrar valoraciones (si no se filtran, se mustran todas)
//URL ejemplo: http://localhost:3000/reviews
app.get("/reviews", isAdmin, filterReviews);

//POST - Crear una valoración
//URL ejemplo: http://localhost:3000/review/3/2
app.post(
  "/review/:space_id/:user_id",
  spaceExists,
  userExists,
  isAuthorized,
  newReview
);

//PUT- Editar una valoración
//URL ejemplo: http://localhost:3000/review/3
app.put("/review/:review_id", reviewExists, isAuthorized, editReview);

//DELETE - Eliminar una valoración
//URL ejemplo: http://localhost:3000/review/5/
app.delete("/review/:review_id", reviewExists, isAuthorized, deleteReview);

// #################################################################
// #                     Endpoints de reportes                     #
// #################################################################

//GET - Filtrar reportes (si no se filtran, se muestran todos)
//URL ejemplo: http://localhost:3000/report/
app.get("/report", isAdmin, filterReports);

//POST - Crear un reporte
//URL ejemplo: http://localhost:3000/report/1/3
app.post(
  "/report/:user_id/:space_id",
  userExists,
  isAuthorized,
  spaceExists,
  newReport
);

//POST - Responder un reporte
//URL ejemplo: http://localhost:3000/report/1
app.post("/report/:report_id", isAdmin, reportExists, answerReports);

//PUT - Editar un reporte
//URL ejemplo: http://localhost:3000/report/1
app.put("/report/:report_id", isAdmin, reportExists, editReport);

// #################################################################
// #                     Endpoints de usuarios                     #
// #################################################################

//GET - Validar el email de un usuario (en el registro o en el cambio de correo)
//URL ejemplo_ http://localhost:3000/users/validate/a13a9ab9392...
app.get("/users/validate/:validationCode", validateUser);

//POST - Registrar un nuevo usuario
//URL ejemplo_ http://localhost:3000/users
app.post("/users", addUser);

//POST - Iniciar sesión (le da un token al usuario)
//URL ejemplo_ http://localhost:3000/users/login
app.post("/users/login", loginUser);

//GET - Muestra información de un usuario
//URL ejemplo_ http://localhost:3000/users/6
app.get("/users/:user_id", userExists, isAuthorized, getUser);

//DELETE - Elimina un usuario (lo vuelve anónimo)
//URL ejemplo_ http://localhost:3000/users/5
app.delete("/users/:user_id", userExists, isAuthorized, deleteUser);

//PUT - Modifica los datos de un usuario
app.put("/users/:user_id", userExists, isAuthorized, editUser);

//GET - Filtrar usuarios (si no se filtra,, se muestran todos)
//URL ejemplo_ http://localhost:3000/users/?user_id=&name=&surname=&...
app.get("/users", isAdmin, filterUsers);

//POST - Enviar un email a un usuario
//URL ejemplo: http://localhost:3000/users/contact/5
app.post("/users/contact/:user_id", isAdmin, userExists, contactUser);

//PUT - Modifica la contraseña de un usuario
//URL ejemplo: http://localhost:3000/users/changePassword
app.put(
  "/users/:user_id/changePassword",
  userExists,
  isAuthorized,
  editPassword
);

//POST - Recuperar contraseña (envia email al usuario, no modifica la contraseña)
//URL ejemplo: http://localhost:3000/users/recoverPassword
app.post("/users/recoverPassword", recoverUserPassword);

//POST - Resetear contraseña (modifica la contraseña)
//URL ejemplo: http://localhost:3000/users/resetPassword
app.post("/users/resetPassword", resetUserPassword);

// #################################################################
// #                 Endpoints not found y error                   #
// #################################################################

// Middleware de error
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: "error",
    message: error.message,
  });
});

// Middleware de 404
app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Not found",
  });
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT} 🚀`);
});
