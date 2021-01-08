require("dotenv").config();
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const { PORT } = process.env;
const getDB = require("./db");
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

//Controladores de reviews
const {
  newReview,
  editReview,
  deleteReview,
  filterReviews,
} = require("./controllers/reviews");

//Controladores de reports
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

// Creamos la app de express
const app = express();
// Guardo db en el local de express
app.locals.getDB = getDB;
// Body parser (body en JSON)
app.use(bodyParser.json());
// Body parser (multipart form data <- subida de imágenes)
app.use(fileUpload());
// Logger
app.use(morgan("dev"));

/**
 * Espacios         Hecho 🦧
 */

//GET - Petición para un espacio en concreto(:id)
// http://localhost:3000/spaces/1
app.get("/spaces/:space_id", spaceExists, getSpace);

//Filtrar espacios (si no se filtra, se muestran todos)
// http://localhost:3000/spaces?aforo=23
app.get("/spaces", filterSpaces);

// Crear espacios
// http://localhost:3000/spaces
app.post("/spaces", newSpace);

//Editar espacios
//http://localhost:3000/spaces/3
app.put("/spaces/:space_id", spaceExists, editSpace);

//Eliminar espacios
//http://localhost:3000/spaces/11
app.delete("/spaces/:space_id", spaceExists, deleteSpace);

//Cambiar estado espacio: habilitado/inhabilitado

app.get("/enableSpace/:space_id", spaceExists, changeStateSpaces);

/**
 * reservas         Hecho 🦧
 */

//GET - /:user_id/bookings--obtener reservas de usuario
//http://localhost:3000/1/bookings
app.get("/:user_id/bookings", userExists, getReservation);

//POST - /space/:space_id/:user_id  --hacer una reserva
//http://localhost:3000/space/1/1
app.post("/space/:space_id/:user_id", userExists, spaceExists, newReservation);

//PUT - /:user_id/bookings/:reservation_id -- modificar una reserva
//http://localhost:3000/1/bookings/1"
app.put(
  "/:user_id/bookings/:reservation_id",
  userExists,
  isAuthorized,
  reservationExists,
  editReservation
);
//DELETE - /id_user/bookings:id_reservation --eliminar una reserva
//http://localhost:3000/1/bookings/1"
app.delete(
  "/:user_id/bookings/:reservation_id",
  userExists,
  isAuthorized,
  reservationExists,
  deleteReservation
);

/**
 * packs             Hecho 🦧
 */

// ver packs
// http://localhost:3000/packs
app.get("/packs", isAdmin, getPack);

// Añadir packs
// http://localhost:3000/packs
app.post("/packs", newPack);

//Editar packs
// http://localhost:3000/packs/1
app.put("/packs/:pack_id", isAdmin, packExists, editPack);

// Eliminar packs
// http://localhost:3000/packs/5
app.delete("/packs/:pack_id", isAdmin, packExists, deletePack);

/**
 * Reviews         (Falta get valoraciones)
 */

//filtrar reviews de un espacio por review_id,user_id,type,review_date
app.get("/reviews", isAdmin, filterReviews);

//Crear valoracion
app.post(
  "/review/:space_id/:user_id",
  spaceExists,
  userExists,
  isAuthorized,
  newReview
);

//Editar valoración
app.put("/review/:review_id", reviewExists, isAuthorized, editReview);
//Eliminar valoraciones
app.delete("/review/:review_id", reviewExists, isAuthorized, deleteReview);

/**
 * Reportes
 */

// GET Filtrar reportes
//URL de ejemplo: http://localhost:3000/report/
app.get("/report", isAdmin, filterReports);

// POST Nuevos reportes
// URL ejemplo: http://localhost:3000/report/1/3
app.post(
  "/report/:user_id/:space_id",
  isAuthorized,
  userExists,
  spaceExists,
  newReport
);

// POST Responder reportes
// URL de ejemplo: http://localhost:3000/report/1
app.post("/report/:report_id", isAdmin, reportExists, answerReports);

// PUT Editar reportes
// URL de ejemplo: http://localhost:3000/report/1
app.put("/report/:report_id", isAdmin, reportExists, editReport);

/**
 * Usuarios
 */

//POST - /users --registrar un nuevo usuario
//http://localhost:3000/users
app.post("/users", addUser);

// GET - /users/validate/:validationcode
// Valida un usuario que se acaba de registrar
app.get("/users/validate/:validationCode", validateUser);

// POST - /users/login
// Hace login de un usuario
app.post("/users/login", loginUser);

// GET - /users/:id
// Muestra información de usuario ✅
app.get("/users/:user_id", userExists, isAuthorized, getUser);

// DELETE - /users/:id
// Anonimiza un usuario ✅
app.delete("/users/:user_id", userExists, isAuthorized, deleteUser);

// PUT - /users/:id
// Edita los datos de un usuario ✅
app.put("/users/:user_id", userExists, isAuthorized, editUser);

// GET - /users/?user_id=&name=&surname=&company=&admin=&verified=&deleted=&registration_date= --filtra los usuarios
// Filtra los datos de un usuario ✅
app.get("/users", isAdmin, filterUsers);

//POST Contactar un usuario
app.post("/contact/:user_id", isAdmin, userExists, contactUser);

// PUT - /users/:id/changePassword
// Modifica la contraseña de un usuario
app.put(
  "/users/:user_id/changePassword",
  userExists,
  isAuthorized,
  editPassword
);

//POST recuperar contraseña
app.post("/users/recoverPassword", recoverUserPassword);

//POST resetear contraseña
app.post("/users/resetPassword", resetUserPassword);

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
