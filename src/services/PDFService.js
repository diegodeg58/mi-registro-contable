const fs = require("fs");
const path = require("path");
const os = require("os");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const handlebars = require("handlebars");

const crearPDFCotizacion = async (input, res) => {
  const fontRobotoPath = path.join(
    process.cwd(),
    "fonts",
    "Roboto-Regular.ttf",
  );
  const installFonts = async () => {
    const fontDir = path.join(os.tmpdir(), ".fonts");
    if (!fs.existsSync(fontDir)) {
      fs.mkdirSync(fontDir, { recursive: true });
    }
    const destPath = path.join(fontDir, "Roboto-Regular.ttf");
    if (!fs.existsSync(destPath)) {
      fs.copyFileSync(fontRobotoPath, destPath);
    }
  };
  await installFonts();

  const html = await fs.promises.readFile(
    path.join(__dirname, "..", "..", "views", "pdf", "cotizacion.hbs"),
    "utf8",
  );
  const template = handlebars.compile(html);
  const htmlRender = template(input);

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
      args: [...chromium.args, "--font-render-hinting=none"],
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.setContent(htmlRender, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      margin: {
        top: "130px",
        bottom: "130px",
        left: "50px",
        right: "50px",
      },
      printBackground: true,
      headerTemplate: header,
      footerTemplate: footer,
      displayHeaderFooter: true,
    });
    await browser.close();

    // const pdfNode = await import("pdf-node");
    // const result = await pdfNode.generatePDF(document);

    const filename = `Cot-${input.client.name}-${String(
      input.nro_cot,
    ).padStart(3, "0")}`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${filename}.pdf`);
    res.setHeader("Content-Length", pdfBuffer.byteLength);
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
  formatToCLP,
};
