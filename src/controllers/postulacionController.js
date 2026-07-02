/**
 * Controlador de Postulaciones a Actividades
 * Maneja el flujo: consultar elegibles -> voluntario postula/acepta -> organización asigna
 */

const { sendSuccess, sendError } = require('../handlers/responseHandler');
const postulacionService = require('../services/postulacionService');

const RUT_REGEX = /^\d{7,8}-[kK\d]$/;

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

const validarRutBody = (res, rut) => {
  if (!rut || !RUT_REGEX.test(rut)) {
    sendError(res, 400, 'Debes enviar un RUT valido con formato XXXXXXXX-X');
    return false;
  }
  return true;
};

// Organización: obtiene los voluntarios activos que cumplen los requisitos de la actividad
const obtenerVoluntariosElegibles = async (req, res) => {
  const { id } = req.params;
  if (!validarIdParam(res, id)) return undefined;

  try {
    const voluntarios = await postulacionService.obtenerVoluntariosElegibles(id);
    return sendSuccess(res, 200, 'Voluntarios elegibles obtenidos correctamente', voluntarios);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

// Voluntario: se postula o acepta la invitación a una actividad para la que es elegible
const postularOAceptar = async (req, res) => {
  const { id } = req.params;
  const { rut } = req.body;

  if (!validarIdParam(res, id)) return undefined;
  if (!validarRutBody(res, rut)) return undefined;

  try {
    const postulacion = await postulacionService.postularOAceptar(rut, id);
    return sendSuccess(res, 201, 'Postulación registrada correctamente. Queda a la espera de la asignación definitiva de la organización', postulacion);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

// Organización: lista los voluntarios que se postularon/aceptaron o fueron asignados
const listarPostulantes = async (req, res) => {
  const { id } = req.params;
  if (!validarIdParam(res, id)) return undefined;

  try {
    const postulantes = await postulacionService.listarPostulantes(id);
    return sendSuccess(res, 200, 'Postulantes obtenidos correctamente', postulantes);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

// Organización: asignación definitiva del voluntario a la actividad
const asignarVoluntario = async (req, res) => {
  const { id } = req.params;
  const { rut } = req.body;

  if (!validarIdParam(res, id)) return undefined;
  if (!validarRutBody(res, rut)) return undefined;

  try {
    const asignadoPor = req.user ? (req.user.email || req.user.name || String(req.user.id)) : null;
    const postulacion = await postulacionService.asignarVoluntario(id, rut, asignadoPor);
    return sendSuccess(res, 200, 'Voluntario asignado correctamente a la actividad', postulacion);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

module.exports = {
  obtenerVoluntariosElegibles,
  postularOAceptar,
  listarPostulantes,
  asignarVoluntario
};
