//Dependencias de express
const express = require('express');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const path = require('path');

//Variables de entorno
require('dotenv').config()

//Rutas
const routes = require("./routes/routes.js");

const app = express();
app.use(express.json()); //Para CRUD con JSON
app.use(cookieParser()); //Para cookies

const __node_modules = `${__dirname}/node_modules`;
app.use("/assets/js",
  express.static(`${__node_modules}/store/dist`),
  express.static(`${__node_modules}/bootstrap/dist/js`),
  express.static(`${__node_modules}/jquery/dist`),
  express.static(`${__node_modules}/js-cookie/dist`)
  )
app.use("/assets/css",
  express.static(`${__dirname}/assets/css`),
  express.static(`${__node_modules}/bootstrap/dist/css`))

const port = process.env.PORT || 3000;
const url = process.env.BASE_URL || `http://localhost:${port}`;
app.listen(port, console.log(`Servidor activo en: ${url}`));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs.engine({
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
    extname: "hbs",
    defaultLayout: "main",
  })
);

app.use(routes)

console.log(process.env.NODE_ENV);