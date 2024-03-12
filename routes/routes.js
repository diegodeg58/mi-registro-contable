const express = require("express");
const app = express.Router();

//Controlador
const {
  getIndex,
  getLastTransactions,
  getFinanzas,
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  getFinanza,
  postFinanza,
  putFinanza,
  deleteFinanza
} = require('../src/controller/controller.js');

app.get('/', getIndex);

app.get('/login', getLogin)
app.post('/login', postLogin)

app.get('/register', getRegister)
app.post('/register', postRegister)

app.get('/ultimas', getLastTransactions);
app.get('/finanzas', getFinanzas);

app.get('/finanza', getFinanza);
app.post('/finanza', postFinanza);
app.put('/finanza', putFinanza);
app.delete('/finanza', deleteFinanza);

module.exports = app;