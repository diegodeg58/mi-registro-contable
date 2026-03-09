const { Router }  = require("express");
const apiV1 = require('../api/api-routes-v1.js')

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
} = require('../controller/controller.js');

const router = Router();
router.use('/api/v1', apiV1);

router.get('/', verifyToken, getIndex);

router.route('/login')
  .get(getLogin)
  .post(postLogin);

router.route('/register')
  .get(getRegister)
  .post(postRegister);

router.route('/crear')
  .get(getCrear);

/* app.get('/ultimas', getLastTransactions);
app.get('/finanzas', getFinanzas);

app.route('/finanza')
  .get(getFinanza)
  .post(postFinanza)
  .put(putFinanza)
  .delete(deleteFinanza); */

module.exports = router;