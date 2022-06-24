const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const jwt = require('jsonwebtoken');

const privateKey = 'rAnDoMPaSsWoRd';

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Servidor activo en puerto ${port}`));

app.get('/', (req, res) => {
    res.send("Hola mundo");
})