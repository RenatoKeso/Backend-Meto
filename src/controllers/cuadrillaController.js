const { sendSuccess, sendError } = require('../handlers/responseHandler');
const cuadrillaService = require('../services/cuadrillaService');
const { createCuadrillaSchema } = require('../validations/cuadrillaValidations');

const parseValidationError = (error) => {
    if (!error || !error.details) return [];
    return error.details.map((detail) => detail.message);
};

const handleServiceError = (res, error) => {
    const statusCode = error.statusCode || 500;
    return sendError(res, statusCode, error.message || 'Error interno del servidor', error.details || null);
};

const crearCuadrilla = async (req, res) => {
    const { error, value } = createCuadrillaSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
});

    if (error) {
    return sendError(res, 400, 'Datos de entrada inválidos', parseValidationError(error));
}

    try {
    const cuadrilla = await cuadrillaService.crearCuadrilla(value);
    return sendSuccess(res, 201, 'Cuadrilla creada correctamente', cuadrilla);
} catch (serviceError) {
    return handleServiceError(res, serviceError);
}
};

const obtenerTodasLasCuadrillas = async (req, res) => {
    try {
    const cuadrillas = await cuadrillaService.obtenerTodasLasCuadrillas();
    return sendSuccess(res, 200, 'Cuadrillas obtenidas correctamente', cuadrillas);
} catch (serviceError) {
    return handleServiceError(res, serviceError);
}
};

module.exports = { crearCuadrilla, obtenerTodasLasCuadrillas };