const pg = require("pg");
const { Pool } = pg;
const production = process.env.NODE_ENV === "production";

devDBConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
};

prodDBConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(production ? prodDBConfig : devDBConfig);

module.exports = {
  getCotizaciones: async () => {
    const result = await pool.query(
      `SELECT c.id, c.timestamp, cl.rut, cl.name
      FROM cotizacion c
      INNER JOIN clientes cl ON cl.id = c.id_client
      ORDER BY c.id
      `,
    );
    return result.rows;
  },
  getFullCotizacionByID: async (id) => {
    const resultCot = await pool.query(
      `SELECT c.pay_method, c.delivery_time, c.currency, 
      c.valid_time, c.comments, c.timestamp, 
      cl.rut, cl.name, cl.person, cl.position, cl.phone, 
      cl.email, cl.city, cl.address, c.id, c.correlativo
      FROM cotizacion c
      INNER JOIN clientes cl ON cl.id = c.id_client
      WHERE c.id = $1
      LIMIT 1
      `,
      [id],
    );
    const resultDet = await pool.query(
      `SELECT line, description, qty, price::numeric::integer, 
      (qty * price)::numeric::integer AS total
      FROM cot_details
      WHERE id_cotizacion = $1`,
      [id],
    );
    const result = { ...resultCot.rows[0], details: resultDet.rows };
    return result;
  },
  postCotizacion: async (data) => {
    const client = await pool.connect();
    try {
      let res;
      res = await client.query("SELECT COUNT(*) FROM cotizacion");
      const count = Number(res.rows[0].count);

      res = await client.query(
        "SELECT id FROM clientes WHERE rut = $1 LIMIT 1",
        [data.rut],
      );
      const id = res.rows[0].id;

      await client.query("BEGIN");
      const insertCotizacionText = `INSERT INTO cotizacion 
      (id_client, pay_method, delivery_time, currency, valid_time, comments, 
      correlativo)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
      const insertCotizacionValues = [
        id,
        data.pay_method,
        data.delivery_time + " day",
        data.currency,
        data.valid_time + " day",
        data.comments,
        count + 1
      ];
      res = await client.query(insertCotizacionText, insertCotizacionValues);
      const idCot = res.rows[0].id;
      data.details.forEach(async (detail, index) => {
        await client.query(
          `INSERT INTO cot_details (id_cotizacion, line, description, qty, 
          price) VALUES ($1, $2, $3, $4, $5)`,
          [idCot, index, detail.description, detail.qty, detail.price],
        );
      });
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },
};
