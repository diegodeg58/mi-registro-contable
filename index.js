//Express, handlebars y cookie-parser
const express = require('express');
const hbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

//Rutas
const routes = require("./routes/routes.js");
const __node_modules = `${__dirname}/node_modules`;

const app = express();
app.use(express.json()); //Para CRUD con JSON
app.use(cookieParser()); //Para cookies

app.use("/assets/js",
  express.static(`${__node_modules}/store/dist`),
  express.static(`${__node_modules}/bootstrap/dist/js`),
  express.static(`${__node_modules}/jquery/dist`)
  )
app.use("/assets/css",
  express.static(`${__dirname}/assets/css`),
  express.static(`${__node_modules}/bootstrap/dist/css`))

const port = process.env.PORT || 3000;
const url = process.env.BASE_URL || `http://localhost:${port}`;
app.listen(port, console.log(`Servidor activo en: ${url}`));

app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs.engine({
    layoutsDir: `${__dirname}/views/layouts`,
    partialsDir: `${__dirname}/views/partials`,
    extname: 'hbs',
    defaultLayout: 'main'
  })
);

app.use(routes)
