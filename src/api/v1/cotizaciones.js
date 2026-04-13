const { Router } = require("express");
const DB = require("../../model/model.js");
const model = require("../../model/model-cotizaciones.js");
const {
  crearPDFCotizacion,
  formatToCLP,
} = require("../../services/PDFService.js");

const router = Router();

router.get("/", async (req, res) => {
  const cotizaciones = await model.getCotizaciones();
  return res.json(cotizaciones);
});

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

router.get("/:id", async (req, res) => {
  const cotizacion = await model.getFullCotizacionByID(req.params.id);
  return res.json(cotizacion);
});

router.get("/:id/pdf", async (req, res) => {
  let cot = await model.getFullCotizacionByID(req.params.id);
  cot = {
    nro_cot: String(cot.correlativo).padStart(3, "0"),
    client: {
      date: new Date(Date.parse(cot.timestamp)).toLocaleDateString("es-CL"),
      person: cot.person,
      name: cot.name,
      position: cot.position,
      address: cot.address,
      phone: cot.phone,
      email: cot.email,
      city: cot.city,
      email: cot.email,
      rut: cot.rut,
    },
    detalles: cot.details.map((detail) => {
      const obj = Object.assign({}, detail);
      obj.line = obj.line + 1;
      obj.price = formatToCLP(obj.price);
      obj.total = formatToCLP(obj.total);
      return obj;
    }),
    totales: {
      total_neto: formatToCLP(
        cot.details.reduce((prev, curr) => {
          return prev + curr.qty * curr.price;
        }, 0),
      ),
      impuesto: formatToCLP(
        cot.details.reduce((prev, curr) => {
          return prev + curr.qty * curr.price;
        }, 0) * 0.1525,
      ),
      total: formatToCLP(
        cot.details.reduce((prev, curr) => {
          return prev + curr.qty * curr.price;
        }, 0) * 1.1525,
      ),
    },
    consideraciones: {
      tipo_pago: cot.pay_method,
      plazo_entrega: `${cot.delivery_time.days ?? 0} días hábiles`,
      tipo_moneda: cot.currency,
      fecha_valida: `${cot.valid_time.days} días hábiles`,
      comentarios: cot.comments,
    },
  };
  crearPDFCotizacion(cot, res);
  // return res.json(cot);
});

module.exports = router;
