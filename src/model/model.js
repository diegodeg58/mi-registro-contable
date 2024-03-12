//DynamoDB
const CyclicDB = require("@diegodeg58/cyclic.sh-dynamodb");
const db = CyclicDB(process.env.CYCLIC_DB);

const tabla = 'finanzas';
const finanzas = db.collection(tabla);

const getLastTransactions = async (qty) => {
  return await finanzas.list(qty);
}

const getTransaction = async (id) => {
  return await finanzas.get(id);
}

const setTransaction = async (id, datos) => {
  return await finanzas.set(id, datos);
}

module.exports = { getLastTransactions, getTransaction, setTransaction }