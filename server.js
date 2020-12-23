require("dotenv").config();
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

//Controladores de espacios
const { filterSpaces } = require("./controllers/spaces");

// Creamos la app de express
const app = express();

/**
 * Espacios
 */

//GET - /spaces
//Filtrar espacios
app.get("/spaces", filterSpaces);
