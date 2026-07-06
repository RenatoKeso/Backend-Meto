const { Cuadrilla } = require('../entities');

const crearCuadrilla = async (datos) => {
    return Cuadrilla.create(datos);
};

const obtenerTodasLasCuadrillas = async () => {
    return Cuadrilla.findAll();
};

module.exports = { crearCuadrilla, obtenerTodasLasCuadrillas };