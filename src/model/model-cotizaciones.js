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
  postCotizacion: async (data) => {
    const client = await pool.connect();
    try {
      let res = await client.query(
        "SELECT id FROM clientes WHERE rut = $1 LIMIT 1",
        [data.rut],
      );
      
      const id = res.rows[0].id;

      await client.query("BEGIN");
      const insertCotizacionText = `INSERT INTO cotizacion 
      (id_client, pay_method, delivery_time, currency, valid_time, comments)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
      const insertCotizacionValues = [
        id,
        data.pay_method,
        data.delivery_time + " day",
        data.currency,
        data.valid_time + " day",
        data.comments,
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
