/**
 * Controlador de Familias
 * Maneja las peticiones HTTP relacionadas con familias beneficiadas
 */
const { sendSuccess, sendError } = require('../handlers/responseHandler');
const familiaService = require('../services/familiaService');
const { createFamiliaSchema, updateFamiliaSchema } = require('../validations/familiaValidations');

// ─────────────────────────────────────────────
// Helpers (mismo patrón que voluntarioController)
// ─────────────────────────────────────────────
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
    sendError(res, 400, 'El ID de la familia debe ser un número entero positivo');
    return false;
  }
  return true;
};

// ─────────────────────────────────────────────
// POST /familias — Registrar una nueva familia
// ─────────────────────────────────────────────
const crearFamilia = async (req, res) => {
  const { error, value } = createFamiliaSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return sendError(res, 400, 'Datos de entrada inválidos', parseValidationError(error));
  }

  try {
    const familia = await familiaService.createFamilia(value);
    return sendSuccess(res, 201, 'Familia registrada correctamente', familia);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

// ─────────────────────────────────────────────
// GET /familias — Consultar todas las familias
// ─────────────────────────────────────────────
const obtenerTodasLasFamilias = async (req, res) => {
  try {
    const incluirInactivas = req.query.incluirInactivas === 'true';
    const familias = await familiaService.getAllFamilias({ incluirInactivas });
    return sendSuccess(res, 200, 'Familias obtenidas correctamente', familias);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

// ─────────────────────────────────────────────
// GET /familias/:id — Consultar una familia por ID
// ─────────────────────────────────────────────
const obtenerFamiliaPorId = async (req, res) => {
  const { id } = req.params;

  if (!validarIdParam(res, id)) return undefined;

  try {
    const familia = await familiaService.getFamiliaById(id);
    return sendSuccess(res, 200, 'Familia obtenida correctamente', familia);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

// ─────────────────────────────────────────────
// PATCH /familias/:id — Actualizar una familia (solo roles autorizados)
// ─────────────────────────────────────────────
const actualizarFamilia = async (req, res) => {
  const { id } = req.params;

  if (!validarIdParam(res, id)) return undefined;

  const { error, value } = updateFamiliaSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return sendError(res, 400, 'Datos de entrada inválidos', parseValidationError(error));
  }

  try {
    const familiaActualizada = await familiaService.updateFamilia(id, value);
    return sendSuccess(res, 200, 'Familia actualizada correctamente', familiaActualizada);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

// ─────────────────────────────────────────────
// DELETE /familias/:id — Borrado lógico (solo roles autorizados)
// ─────────────────────────────────────────────
const eliminarFamilia = async (req, res) => {
  const { id } = req.params;

  if (!validarIdParam(res, id)) return undefined;

  try {
    const familia = await familiaService.deleteFamilia(id);
    const mensaje = familia.yaEstabaInactiva
      ? 'La familia ya estaba inactiva'
      : 'Familia desactivada correctamente';
    return sendSuccess(res, 200, mensaje, familia);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

module.exports = {
  crearFamilia,
  obtenerTodasLasFamilias,
  obtenerFamiliaPorId,
  actualizarFamilia,
  eliminarFamilia
};
