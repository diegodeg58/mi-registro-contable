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
  getClientes: async () => {
    const query = {
      text: "SELECT * FROM clientes",
    };
    const result = await pool.query(query);
    return result.rows;
  },
  postCliente: async (data) => {
    const query = {
      text: `INSERT INTO clientes 
        (rut, name, person, position, phone, email, city, address) VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      values: [
        data.rut,
        data.name,
        data.person,
        data.position,
        data.phone,
        data.email,
        data.city,
        data.address,
      ],
    };
    const result = await pool.query(query);
    return result.rows[0];
  },
};
