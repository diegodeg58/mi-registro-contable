//Express y handlebars
const express = require('express');
const app = express();
const hbs = require('express-handlebars');

//DynamoDB
const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("important-blue-wrapCyclicDB")

//Utilidades
const axios = require('axios').default;
const moment = require('moment');
const { v4 } = require('uuid');
const _ = require('lodash');

app.use(express.json()); //Para CRUD con JSON
app.use('/', express.static(`${__dirname}/assets/css`));
app.use('/store', express.static(`${__dirname}/node_modules/store/dist`));
app.use('/bootstrap', express.static(`${__dirname}/node_modules/bootstrap/dist`));
app.use('/jquery', express.static(`${__dirname}/node_modules/jquery/dist`));

const port = process.env.PORT || 3000;
const url = process.env.BASE_URL || `http://localhost:${port}`;
app.listen(port, console.log(`Servidor activo en puerto ${port}`));

app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs.engine({
    layoutsDir: `${__dirname}/views/layouts`,
    partialsDir: `${__dirname}/views/partials`,
    extname: 'hbs',
    defaultLayout: 'index'
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
    });

  res.render("main", {
    lista
  });
});

app.get('/movimientos', (req, res) => {

});

app.get('/ultimas', async (req, res) => {
  const tabla = 'finanzas';

  let finanzas = db.collection(tabla);
  try {
    let lista = await finanzas.list(8);
    lista = lista.results.map(async (finanza) => {
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
      results: jsonData
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      error: "Ha ocurrido un error obteniendo los datos",
      code: error.$metadata.httpStatusCode
    })
  }
});

app.get('/finanzas', async (req, res) => {
  const tabla = 'finanzas';
  const cantidad = parseInt(req.query.n) > 0 ? parseInt(req.query.n) : 5;
  const pagina = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;

  let finanzas = db.collection(tabla);

  ////////////////
  //TODO: Sección donde se obtiene un arreglo de los <id> que retorna el método list()
  //El tamaño del arreglo depende de la cantidad de páginas que se obtenga a través de list()
  //Para obtener el arreglo se debe realizar un ciclo while hasta que la variable LastEvaluatedKey retorne null
  ////////////////

  try {
    let lista = await finanzas.list(cantidad, /* {
            "keys_gsi": "finanzas",
            "sk": "finanzas#c84e410f",
            "pk": "finanzas#c84e410f",
            "keys_gsi_sk": "2022-07-05T02:47:41.383Z"
        } */);
    const next = lista.next;
    lista = lista.results.map(async (finanza, index) => {
      let lastItem;
      if (index == cantidad - 1) {
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
});

app.get('/finanza', async (req, res) => {
  const id = req.query.id;
  const finanzas = db.collection("finanzas");
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
});

app.post('/finanza', async (req, res) => {
  let datos = req.body;

  const id = v4().slice(0, 8);
  let finanzas = db.collection('finanzas');
  let finanza = await finanzas.set(id, datos);

  res.json(datos);
});

app.put('/finanza', async (req, res) => {

});

app.delete('/finanza', async (req, res) => {

});