require("dotenv").config();
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const { PORT } = process.env;

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
} = require("./controllers/spaces");

//Controladores de packs
const {
  newPack,
  editPack,
  deletePack,
  getPack,
} = require("./controllers/packs");

//Controladores de reviews
const { deleteReview, newReview } = require("./controllers/reviews");

//Controladores de reports
const {
  newReport,
  filterReports,
  editReport,
} = require("./controllers/reports");

//Controladores de usuarios
//const { filterUsers } = require("./controllers/users");

//Middlewares
const {
  userExists,
  spaceExists,
  reservationExists,
  reportExists,
} = require("./middlewares");

// Creamos la app de express
const app = express();
// Body parser (body en JSON)
app.use(bodyParser.json());
// Body parser (multipart form data <- subida de imágenes)
app.use(fileUpload());
// Logger
app.use(morgan("dev"));

/**
 * Espacios         Hecho 🦧 (delete Space)
 */

//GET - Petición para un espacio en concreto(:id)
// http://localhost:3000/spaces/1
app.get("/spaces/:id_spaces", getSpace);

//Filtrar espacios (si no se filtra, se muestran todos)
// http://localhost:3000/spaces?aforo=23
app.get("/spaces", filterSpaces);

// Crear espacios
// http://localhost:3000/spaces
app.post("/spaces", newSpace);

//Editar espacios
//http://localhost:3000/spaces/3
app.put("/spaces/:id", editSpace);

//Eliminar espacios
//http://localhost:3000/spaces/11
app.delete("spaces/:id", deleteSpace);

/**
 * reservas         Hecho 🦧
 */

//GET - :id_user /booking --obtener reservas de usuario
//http://localhost:3000/1/bookings
app.get("/:id_user/bookings", userExists, getReservation);

//POST - /space:id_space/:id_user /booking --hacer una reserva
//http://localhost:3000/space/1/1
app.post("/space/:id_space/:id_user", userExists, spaceExists, newReservation);

//PUT - /id_user/bookings:id_reservation -- modificar una reserva
//http://localhost:3000/1/bookings/1"
app.put(
  "/:id_user/bookings/:id_reservation",
  userExists,
  reservationExists,
  editReservation
);
//DELETE - /id_user/bookings:id_reservation --eliminar una reserva
//http://localhost:3000/1/bookings/1"
app.delete(
  "/:id_user/bookings/:id_reservation",
  userExists,
  reservationExists,
  deleteReservation
);

/**
 * packs             Hecho 🦧
 */

// ver packs
// http://localhost:3000/packs
app.get("/packs", getPack);

// Añadir packs
// http://localhost:3000/packs
app.post("/packs", newPack);

//Editar packs
// http://localhost:3000/packs/1
app.put("/packs/:id", editPack);

// Eliminar packs
// http://localhost:3000/packs/5
app.delete("/packs/:id", deletePack);

/**
 * Reviews         (Falta get valoraciones)
 */
//Crear valoraciones
app.post("/review/:space_id/:user_id", newReview);

//Eliminar valoraciones
app.delete("/spaces/:id/review/:id_review", deleteReview);

/**
 * Reportes
 */

// get reportes
//URL de ejemplo: http://localhost:3000/report/
app.get("/report", filterReports);

// post reportes
// URL ejemplo: http://localhost:3000/report/1/3
// Body de la petición: category:"hardware", description:"Lorem ipsum dolor sit amet...", photo: (una foto)
app.post("/report/:id_user/:id_space", userExists, spaceExists, newReport);

// put reportes
// URL de ejemplo: http://localhost:3000/report/1
app.put("/report/:id_report", reportExists, editReport);

/**
 * Usuarios         (Falta get casitodo)
 */

//get usuarios
//app.get("/users", filterUsers);

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
