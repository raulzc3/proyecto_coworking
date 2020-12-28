require("dotenv").config();
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const {PORT}=process.env;

//Controladores de espacios
const { getSpace,filterSpaces,getReservation,newReport } = require("./controllers/spaces");
const userExists = require("./middlewares/userExists");

// Creamos la app de express
const app = express();

/**
 * Espacios
 */


//GET - Petición para un espacio en concreto(:id)  
// http://localhost:3000/spaces/1
app.get("/spaces/:id",getSpace);

//Filtrar espacios (si no se filtra, se muestran todos)
// http://localhost:3000/spaces?search=Auditorio

app.get("/spaces", filterSpaces);


//get reservas
app.get("/spaces/reserves",getReservation)

//app.post("/report/:user/:space",userExists,newReport)

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT} 🚀`);
  });
  