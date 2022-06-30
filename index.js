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

app.get('/ultimas', (req, res) => {
    let finanzas =  db.collection("finanzas");
    finanzas.list().then((data) => {
        Promise.all(data.results.map(async (finanza) => {
            const item = await finanzas.get(finanza.key);
            return {
                id: finanza.key,
                tipo: item.props.tipo,
                monto: item.props.monto,
                persona: item.props.persona,
                descripcion: item.props.descripcion
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

app.get('/finanza', async (req, res) => {
    const id = req.query.id;
    const finanzas =  db.collection("finanzas");
    const finanza = await finanzas.get(id);
    res.json({
        id: finanza.key,
        tipo: finanza.props.tipo,
        monto: finanza.props.monto,
        fecha: finanza.props.fecha,
        persona: finanza.props.persona,
        descripcion: finanza.props.descripcion,
        fijo: finanza.props.fijo
    });
});

app.post('/finanza', async (req, res) => {
    let datos = req.body;
    
    const id = v4().slice(0,8);
    let finanzas = db.collection('finanzas');
    let finanza = await finanzas.set(id, datos);
    
    res.json(datos);
});

app.put('/finanza', async (req, res) => {
    
});

app.delete('/finanza', async (req, res) => {
    
});