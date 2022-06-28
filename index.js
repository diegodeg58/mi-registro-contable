process.env.CYCLIC_DB = 'important-blue-wrapCyclicDB';

const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const db = require('cyclic-dynamodb');
const axios = require('axios').default;
const moment = require('moment');
const {v4} = require('uuid');
const _ = require('lodash');

app.use(express.json());
app.use('/', express.static(`${__dirname}/assets/css`));
app.use('/assets/js', express.static(`${__dirname}/node_modules/store/dist`));

const port = process.env.PORT || 3000;
const url = process.env.BASE_URL || `http://localhost:${port}`;
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

app.get('/', async (req, res) => {
    let lista;
    await axios.get(`${url}/ultimas`).then((data) => {
        lista = data.data.results;
    })
    .catch((error) => {
        console.error("Error en la petición:", error.code);
    })
    res.render("index", {
        layout: "index",
        lista: lista
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

app.get('/ultimas', (req, res) => {
    let finanzas =  db.collection("finanzas");
    finanzas.list().then((data) => {
        Promise.all(data.results.map(async (finanza) => {
            const item = await finanzas.get(finanza.key);
            console.log(item);
            return {
                id: finanza.key,
                fecha: item.props.fecha,
                monto: item.props.monto,
                persona: item.props.persona,
                descripcion: item.props.descripcion,
                tipo: item.props.tipo
            }
        })).then((data) => {
            res.json({
                results: data
            })
        })
    })
});

app.get('/finanzas', async (req, res) => {
    
});

app.post('/finanzas', async (req, res) => {
    let datos = req.body;
    console.log(datos);
    
    const id = v4().slice(0,8);
    let finanzas = db.collection('finanzas');
    let finanza = await finanzas.set(id, datos);
    
    res.json(datos);
});

app.put('/finanzas', async (req, res) => {
    
});

app.delete('/finanzas', async (req, res) => {
    
});