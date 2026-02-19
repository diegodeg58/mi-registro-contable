const fs = require("fs");
const path = require("path");

const crearPDFCotizacion = async (data, res) => {
  // Read HTML template
  const html = await fs.promises.readFile(
    path.join(__dirname, "..", "..", "views", "pdf", "cotizacion.hbs"),
    "utf8",
  );
  const header = await fs.promises.readFile(
    path.join(__dirname, "..", "..", "views", "pdf", "header.hbs"),
    "utf8",
  );
  const footer = await fs.promises.readFile(
    path.join(__dirname, "..", "..", "views", "pdf", "footer.hbs"),
    "utf8",
  );

  // PDF options with fontconfig path
  const options = {
    format: "letter",
    orientation: "portrait",
    border: "10mm",
    header: {
      contents: header,
      height: "22mm",
    },
    footer: {
      height: "15mm",
      contents: {
        default: footer,
      },
    },
    phantomPath: path.resolve(
      process.cwd(),
      "node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs",
    ),
    childProcessOptions: {
      env: {
        ...process.env,
        OPENSSL_CONF: "/dev/null",
        LD_LIBRARY_PATH: path.join(process.cwd(), "fonts"),
        FONTCONFIG_PATH: path.join(process.cwd(), "fonts"),
      },
    },
  };

  try {
    const document = {
      html: html,
      data: {
        nro_cot: Intl.NumberFormat().format(1).padStart(3, "0"),
        client: {
          date: new Date().toLocaleDateString("es-CL"),
          person: "Jonathan León",
          name: "Warnermedia Chile Inversiones Limitada",
          position: "Contralor",
          address: "Pedro Montt 2354",
          phone: "+56964041248",
          city: "Santiago",
          email: "jonathan.leon@wbd.com",
          rut: "76109205-7",
        },
        detalles: [
          {
            line: 1,
            qty: 100,
            description:
              "Lanyard de 90x2,5 cms cinta sublimada ambas caras, con mosqueton simple",
            price: formatToCLP(2900),
            total: formatToCLP(100 * 2900),
          },
        ],
        totales: {
          total_neto: formatToCLP(100 * 2900),
          impuesto: formatToCLP(100 * 2900 * 0.1525),
          total: formatToCLP(100 * 2900 + 100 * 2900 * 0.1525),
        },
        consideraciones: {
          tipo_pago: "Crédito 30 días",
          plazo_entrega: "15 días hábiles",
          tipo_moneda: "Peso chileno",
          fecha_valida: "10 días hábiles",
          comentarios: "Algunos comentarios",
        },
      },
      type: "pdf",
      buffer: true,
      pdfOptions: options,
    };

    const pdfNode = await import("pdf-node");
    const result = await pdfNode.generatePDF(document);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="MyFile.pdf"');
    res.setHeader("Content-Length", result.size);
    return res.send(result.buffer);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return res.status(500).json({
      error: "Failed to generate PDF",
      details: error.message,
    });
  }
};

const formatToCLP = (number) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(number);
};

module.exports = {
  crearPDFCotizacion,
};
