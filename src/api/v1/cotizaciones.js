const { Router } = require("express");
const DB = require("../../model/model.js");
const model = require("../../model/model-cotizaciones.js");

const router = Router();

router.post("/", async (req, res) => {
  try {
    const response = await model.postCotizacion(req.body);
    res.json(req.body);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      message:
        "Ha ocurrido un error creando la cotización. " +
        DB.getErrorMessage(error.code),
      code: error.code,
    });
  }
});

module.exports = router;
