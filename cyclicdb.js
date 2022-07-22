process.env.CYCLIC_DB = 'important-blue-wrapCyclicDB';
const db = require('cyclic-dynamodb');

const ObtenerUltimas = async (tabla) => {
    let finanzas = db.collection(tabla);
    const MAX_ITEMS = 8;
    try {
        let lista = await finanzas.list(MAX_ITEMS);
        lista = lista.results.map(async (finanza) => {
            const item = await finanzas.get(finanza.key);
            return {
                id: finanza.key,
                tipo: item.props.tipo,
                monto: item.props.monto,
                persona: item.props.persona,
                descripcion: item.props.descripcion
            }
        })
        let jsonData = await Promise.all(lista);
        return{
            results: jsonData
        };
    } catch (error) {
        console.error(error.message);
        return{
            error: "Ha ocurrido un error obteniendo los datos",
            code: error.$metadata.httpStatusCode
        };
    }
}

module.exports = { ObtenerUltimas }