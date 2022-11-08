var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// Gestion des variables d'environnement
require("dotenv").config();

// Connexion Mongo
require("./models/connection");

// Declaration des Routeurs
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var clientsRouter = require("./routes/clients");
var missionsRouter = require("./routes/missions");

var app = express();
const cors = require("cors");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/clients", clientsRouter);
app.use("/missions", missionsRouter);

module.exports = app;
