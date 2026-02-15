const fs = require("fs");
const path = require("path");

const formatToCLP = (number) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(number);
}

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

  // PDF options with TypeScript type
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
    directory: "/tmp"
  };

  try {
    // Document configuration for buffer output
    const document = {
      html: html,
      data: {
        nro_cot: Intl.NumberFormat().format(1).padStart(3, '0'),
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
      buffer: true, // Enable buffer output
      pdfOptions: options,
    };

    // Generate PDF buffer
    const pdfNode = await import('pdf-node');
    const result = await pdfNode.generatePDF(document);

    // Set appropriate headers and send buffer
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="MyFile.pdf"');
    res.setHeader("Content-Length", result.size);
    return res.send(result.buffer);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to generate PDF",
    });
  }
};

module.exports = {
  crearPDFCotizacion,
};
