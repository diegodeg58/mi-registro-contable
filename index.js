process.env.CYCLIC_DB = 'important-blue-wrapCyclicDB';

const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const db = require('cyclic-dynamodb');
const moment = require('moment');
const store = require('store');

app.use(express.json());
app.use('/', express.static(`${__dirname}/assets/css`));

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Servidor activo en puerto ${port}`));

app.set("view engine", "handlebars");
app.engine(
    "handlebars",
    hbs.engine({
        layoutsDir: `${__dirname}/views`,
        partialsDir: `${__dirname}/views/partials`
    })
);

/* app.use('/', (req, res, next) => {
    
}) */

app.get('/', (req, res) => {
    res.render("index", {
        layout: "index"
    });
});

app.get('/cosas', async (req, res) => {
    let cosas = db.collection('cosas');
    res.send(await cosas.list());
});

app.post('/cosas', async (req, res) => {
    let cosas = db.collection('cosas');
    let objeto1 = await cosas.set('objeto1', {
        tipo: 'cosa'
    });
    res.send(objeto1);
});

app.get('/finanzas', async (req, res) => {
    
});

app.post('/finanzas', async (req, res) => {
    let datos = req.body;
    console.log(datos);
    res.json(datos);
});

app.put('/finanzas', async (req, res) => {
    
});

app.delete('/finanzas', async (req, res) => {
    
});