

const { sendSuccess, sendError } = require('../handlers/responseHandler');
const actividadService = require('../services/actividadService');
const { createActividadSchema, updateActividadSchema } = require('../validations/actividadValidation');


const parseValidationError = (error) => {
  if (!error || !error.details) return [];
  return error.details.map((detail) => detail.message);
};

const handleServiceError = (res, error) => {
  const statusCode = error.statusCode || 500;
  return sendError(res, statusCode, error.message || 'Error interno del servidor', error.details || null);
};

const validarIdParam = (res, id) => {
  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    sendError(res, 400, 'El ID de la actividad debe ser un número entero positivo');
    return false;
  }
  return true;
};

//Crear una nueva actividad

const crearActividad = async (req, res) => {
  const { error, value } = createActividadSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return sendError(res, 400, 'Datos de entrada inválidos', parseValidationError(error));
  }

  try {
    // id_usuario viene del token JWT (puesto por verifyToken en req.user)
    const payload = { ...value, id_usuario: req.user.id };
    const actividad = await actividadService.crearActividad(payload);
    return sendSuccess(res, 201, 'Actividad creada correctamente', actividad);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

// 
//  Obtener todas las actividades

const ObtenerTodasLasActividades = async (req, res) => {
  try {
    const actividades = await actividadService.ObtenerTodasLasActividades();
    return sendSuccess(res, 200, 'Actividades obtenidas correctamente', actividades);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

//Obtener una actividad por ID

const ObtenerActividadPorID = async (req, res) => {
  const { id } = req.params;

  if (!validarIdParam(res, id)) return undefined;

  try {
    const actividad = await actividadService.ObtenerActividadPorID(id);
    return sendSuccess(res, 200, 'Actividad obtenida correctamente', actividad);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

//Modificar una actividad
const ModificarActividad = async (req, res) => {
  const { id } = req.params;

  if (!validarIdParam(res, id)) return undefined;

  const { error, value } = updateActividadSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return sendError(res, 400, 'Datos de entrada inválidos', parseValidationError(error));
  }

  try {
    const actividadActualizada = await actividadService.ModificarActividad(id, value);
    return sendSuccess(res, 200, 'Actividad actualizada correctamente', actividadActualizada);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

//Eliminar una actividad
const EliminarActividad = async (req, res) => {
  const { id } = req.params;

  if (!validarIdParam(res, id)) return undefined;

  try {
    const resultado = await actividadService.EliminarActividad(id);
    return sendSuccess(res, 200, 'Actividad eliminada correctamente', resultado);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

module.exports = {
  crearActividad,
  ObtenerTodasLasActividades,
  ObtenerActividadPorID,
  ModificarActividad,
  EliminarActividad,
};