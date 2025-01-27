const pg = require("pg");
const { Pool } = pg;
const production = process.env.NODE_ENV === "production";

devDBConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

prodDBConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const pool = new Pool(production ? prodDBConfig : devDBConfig);

const getLastTransactions = async (qty) => {
}

const getTransaction = async (id) => {
}

const setTransaction = async (id, datos) => {
}

const setNewUser = async (datos) => {
  const query = {
    text: 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
    values: [datos.user, datos.email, datos.password],
  };
  const result = await pool.query(query);
}

const getUser = async (user) => {
  const query = {
    text: 'SELECT * FROM users WHERE email = $1 OR username = $1',
    values: [user],
  };
  const result = await pool.query(query);
  return result.rows[0];
}

const getErrorMessage = (code) => {
  switch (Number(code)) {
    case 23502:
      return "Faltan datos";
    case 23505:
      return "El email ya está registrado";
    default:
      return "Ha ocurrido un error";
  }
}

module.exports = {
  getLastTransactions,
  getTransaction,
  setTransaction,
  setNewUser,
  getErrorMessage,
  getUser,
};