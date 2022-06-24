process.env.CYCLIC_DB = 'important-blue-wrapCyclicDB';

const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const jwt = require('jsonwebtoken');
const db = require('cyclic-dynamodb');

const privateKey = 'rAnDoMPaSsWoRd';

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