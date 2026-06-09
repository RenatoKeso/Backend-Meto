const { sendSuccess, sendError } = require('../handlers/responseHandler');
const donacionService = require('../services/donacionService');

const handleServiceError = (res, error) => {
  const statusCode = error.statusCode || 500;
  return sendError(res, statusCode, error.message || 'Error interno del servidor', error.details || null);
};

const crearDonacion = async (req, res) => {
  try {
    const donacion = await donacionService.crearDonacion(req.body);
    return sendSuccess(res, 201, 'Donación registrada correctamente', donacion);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

const obtenerDonaciones = async (req, res) => {
  try {
    const donaciones = await donacionService.obtenerDonaciones();
    return sendSuccess(res, 200, 'Donaciones obtenidas correctamente', donaciones);
  } catch (serviceError) {
    return handleServiceError(res, serviceError);
  }
};

module.exports = { crearDonacion, obtenerDonaciones };