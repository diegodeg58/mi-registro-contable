const { Router } = require("express");
const cotizaciones = require('./v1/cotizaciones.js');
const clientes = require('./v1/clientes.js');

const apiV1 = Router();

apiV1.use('/cotizaciones', cotizaciones);
apiV1.use('/clientes', clientes);

module.exports  = apiV1;