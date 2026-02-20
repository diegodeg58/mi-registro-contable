const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

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

  try {
    const executablePath = await chromium.executablePath();
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true, // ¡Vital para que se impriman los colores de fondo de las tablas!
      margin: {
        top: "20px",
        bottom: "20px",
        left: "20px",
        right: "20px",
      },
    });

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
    };

    // const pdfNode = await import("pdf-node");
    // const result = await pdfNode.generatePDF(document);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="MyFile.pdf"');
    res.setHeader("Content-Length", result.size);
    return res.send(pdfBuffer);
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
