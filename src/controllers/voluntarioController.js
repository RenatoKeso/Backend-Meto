/**
 * Controlador de Voluntarios
 * Maneja las peticiones HTTP relacionadas con voluntarios
 */

const { sendSuccess, sendError } = require('../handlers/responseHandler');
const voluntarioService = require('../services/voluntarioService');
const { createVoluntarioSchema, updateVoluntarioSchema } = require('../validations/voluntarioValidations');

const RUT_REGEX = /^\d{7,8}-[kK\d]$/;

const parseValidationError = (error) => {
  if (!error || !error.details) {
    return [];
  }

  return error.details.map((detail) => detail.message);
};

const handleServiceError = (res, error) => {
  const statusCode = error.statusCode || 500;
  return sendError(res, statusCode, error.message || 'Error interno del servidor', error.details || null);
};

const validarRutParam = (res, rut) => {
  if (!RUT_REGEX.test(rut)) {
    sendError(res, 400, 'El RUT debe tener el formato XXXXXXXX-X');
    return false;
  }

  return true;
};

const crearVoluntario = async (req, res) => {
  const { error, value } = createVoluntarioSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return sendError(res, 400, 'Datos de entrada invalidos', parseValidationError(error));
  }

  try {
    const voluntario = await voluntarioService.createVoluntario(value);
    return sendSuccess(res, 201, 'Voluntario creado correctamente', voluntario);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

const obtenerTodosLosVoluntarios = async (req, res) => {
  try {
    const incluirInactivos = req.query.incluirInactivos === 'true';
    const voluntarios = await voluntarioService.getAllVoluntarios({ incluirInactivos });

    return sendSuccess(res, 200, 'Voluntarios obtenidos correctamente', voluntarios);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

const obtenerVoluntarioPorId = async (req, res) => {
  const { rut } = req.params;

  if (!validarRutParam(res, rut)) {
    return undefined;
  }

  try {
    const voluntario = await voluntarioService.getVoluntarioByRut(rut);
    return sendSuccess(res, 200, 'Voluntario obtenido correctamente', voluntario);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

const actualizarVoluntario = async (req, res) => {
  const { rut } = req.params;

  if (!validarRutParam(res, rut)) {
    return undefined;
  }

  const { error, value } = updateVoluntarioSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return sendError(res, 400, 'Datos de entrada invalidos', parseValidationError(error));
  }

  try {
    const voluntarioActualizado = await voluntarioService.updateVoluntario(rut, value);
    return sendSuccess(res, 200, 'Voluntario actualizado correctamente', voluntarioActualizado);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

const eliminarVoluntario = async (req, res) => {
  const { rut } = req.params;

  if (!validarRutParam(res, rut)) {
    return undefined;
  }

  try {
    const voluntario = await voluntarioService.deleteVoluntario(rut);
    const mensaje = voluntario.yaEstabaInactivo
      ? 'El voluntario ya estaba inactivo'
      : 'Voluntario desactivado correctamente';

    return sendSuccess(res, 200, mensaje, voluntario);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

module.exports = {
  crearVoluntario,
  obtenerTodosLosVoluntarios,
  obtenerVoluntarioPorId,
  actualizarVoluntario,
  eliminarVoluntario
};
