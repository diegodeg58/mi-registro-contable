const { Router } = require("express");
const DB = require("../../model/model.js");
const model = require('../../model/model-clientes.js');

const router = Router();

router.get('/', async (req, res) => {
  const clientes = await model.getClientes();
  return res.json(clientes.map(item => {
    delete item.id;
    return item;
  }));
})

router.post("/", async (req, res) => {
  try {
    const response = await model.postCliente(req.body);
    delete response.id;
    res.json(response);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      message:
        "Ha ocurrido un error guardando el nuevo cliente. " +
        DB.getErrorMessage(error.code),
      code: error.code,
    });
  }
});

module.exports = router;
