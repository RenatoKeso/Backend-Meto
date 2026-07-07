const { sendSuccess, sendError } = require('../handlers/responseHandler');
const cuadrillaService = require('../services/cuadrillaService');
const { createCuadrillaSchema, asignarVoluntarioSchema } = require('../validations/cuadrillaValidations');

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

const obtenerCuadrillaPorId = async (req, res) => {
    try {
        const cuadrilla = await cuadrillaService.obtenerCuadrillaPorId(req.params.id);
        return sendSuccess(res, 200, 'Cuadrilla obtenida correctamente', cuadrilla);
    } catch (serviceError) {
        return handleServiceError(res, serviceError);
    }
};

const asignarVoluntario = async (req, res) => {
    const { error, value } = asignarVoluntarioSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        return sendError(res, 400, 'Datos de entrada inválidos', parseValidationError(error));
    }

    try {
        const voluntario = await cuadrillaService.asignarVoluntario(req.params.id, value.rut);
        return sendSuccess(res, 200, 'Voluntario asignado correctamente', voluntario);
    } catch (serviceError) {
        return handleServiceError(res, serviceError);
    }
};

const quitarVoluntario = async (req, res) => {
    try {
        const voluntario = await cuadrillaService.quitarVoluntario(req.params.rut);
        return sendSuccess(res, 200, 'Voluntario removido de la cuadrilla correctamente', voluntario);
    } catch (serviceError) {
        return handleServiceError(res, serviceError);
    }
};

module.exports = {
    crearCuadrilla,
    obtenerTodasLasCuadrillas,
    obtenerCuadrillaPorId,
    asignarVoluntario,
    quitarVoluntario
};
