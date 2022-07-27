const db = require('./cyclicdb.js');

const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const axios = require('axios').default;
const moment = require('moment');
const {v4} = require('uuid');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());
app.use('/', express.static(`${__dirname}/assets/css`));
app.use('/assets/js', express.static(`${__dirname}/node_modules/store/dist`));

const port = process.env.PORT || 3000;
const url = process.env.BASE_URL || `http://localhost:${port}`;
const privateKey = process.env.privateKey;

app.listen(port, console.log(`Servidor activo en puerto ${port}`));

app.set("view engine", "handlebars");
app.engine(
    "handlebars",
    hbs.engine({
        layoutsDir: `${__dirname}/views`,
        partialsDir: `${__dirname}/views/partials`
    })
);

app.get('/', async (req, res) => {
    console.log(req.cookies);
    let lista;
    /*
    const token = req.query.token;
    if(req.headers.cookie) console.log((req.headers.cookie).split('=')[1]);
    if(!token){
        //TODO: Inicio de sesión
    }else{
        await axios.get(`${url}/ultimas`).then((data) => {
            lista = data.data.results;
        })
        .catch((error) => {
            console.error("Error obteniendo la lista:", error.code);
            lista = undefined;
        });
    }
    */
    //res.cookie("name", Date.now());
    res.render("index", {
        layout: "index",
        lista
    });
});

app.post('/login', (req, res) => {
    //TODO: Obtener registro de usuario
    const { usuario, password } = req.body;
    if(usuario == 'user' && password == 'pass'){
        const token = jwt.sign({usuario, password}, privateKey);
        return res.cookie('token', token).json({token})
    }
    return res.status(401).json({error: "No autorizado"});
});

app.get('/registro', (req, res) => {
    res.render("registro", {
        layout: "registro",
    });
});

app.post('/registro', (req, res) => {
    //TODO: Obtener de la lista de registros si el email aparece registrado
    
    res.statusMessage = req.body.nombre;
    console.log(req.body.nombre);
    res.status(401).json(req.body.nombre);
});

app.get('/movimientos', (req, res) => {
    
});

app.get('/ultimas', async (req, res) => {
    const finanzas = await db.ObtenerUltimas('finanzas');
    const status_code = finanzas ? 200 : 404;
    res.status(status_code).json(finanzas);
});

app.get('/finanzas', async (req, res) => {
    const tabla = 'finanzas';
    const cantidad = parseInt(req.query.n) > 0 ? parseInt(req.query.n) : 5;
    const pagina = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
    
    //let finanzas = db.collection(tabla);

    ////////////////
    //TODO: Sección donde se obtiene un arreglo de los <id> que retorna el método list()
    //El tamaño del arreglo depende de la cantidad de páginas que se obtenga a través de list()
    //Para obtener el arreglo se debe realizar un ciclo while hasta que la variable LastEvaluatedKey retorne null
    ////////////////
    /*
    try {
        let lista = await finanzas.list(cantidad, {
            "keys_gsi": "finanzas",
            "sk": "finanzas#c84e410f",
            "pk": "finanzas#c84e410f",
            "keys_gsi_sk": "2022-07-05T02:47:41.383Z"
        } );
        const next = lista.next;
        lista = lista.results.map(async (finanza, index) => {
            let lastItem;
            if(index == cantidad - 1){
                lastItem = finanza;
                console.log(lastItem);
            }
    
            const item = await finanzas.get(finanza.key);
            return {
                id: finanza.key,
                tipo: item.props.tipo,
                monto: item.props.monto,
                persona: item.props.persona,
                descripcion: item.props.descripcion
            }
        })
        let jsonData = await Promise.all(lista);
        
        res.json({
            results: jsonData,
            next: next
        });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            error: "Ha ocurrido un error",
            code: error.$metadata.httpStatusCode
        })
    }
    */
});

app.get('/finanza', async (req, res) => {
    const id = req.query.id;
    /*
    const finanzas =  db.collection("finanzas");
    try {
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
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            error: "Ha ocurrido un error",
            code: error.$metadata.httpStatusCode
        })
    }
    */
});

app.post('/finanza', async (req, res) => {
    let datos = req.body;
    /*
    const id = v4().slice(0,8);
    let finanzas = db.collection('finanzas');
    let finanza = await finanzas.set(id, datos);
    */
    res.json(datos);
});

app.put('/finanza', async (req, res) => {
    
});

app.delete('/finanza', async (req, res) => {
    
});
