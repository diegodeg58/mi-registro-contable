const express = require("express");
const app = express.Router();

//Controlador
const {
  verifyToken,
  getIndex,
/*   getLastTransactions,
  getFinanzas, */
  getLogin,
  postLogin,
  getRegister,
  postRegister,
/*   getFinanza,
  postFinanza,
  putFinanza,
  deleteFinanza */
  getCrear
} = require('../src/controller/controller.js');

app.get('/', verifyToken, getIndex);

app.route('/login')
  .get(getLogin)
  .post(postLogin);

app.route('/register')
  .get(getRegister)
  .post(postRegister);

app.route('/crear')
  .get(getCrear);

/* app.get('/ultimas', getLastTransactions);
app.get('/finanzas', getFinanzas);

app.route('/finanza')
  .get(getFinanza)
  .post(postFinanza)
  .put(putFinanza)
  .delete(deleteFinanza); */

module.exports = app;