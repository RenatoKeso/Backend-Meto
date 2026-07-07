const { sendSuccess, sendError } = require('../handlers/responseHandler');
const donacionService = require('../services/donacionService');
const { crearDonacionSchema } = require('../validations/donacionValidations');

const manejarError = (res, error) => {
  const statusCode = error.statusCode || 500;
  return sendError(res, statusCode, error.message || 'Error en el servidor', error.details || null);
};

const crearDonacion = async (req, res) => {
  // req.body llega como strings porque viene de un form-data (por el archivo adjunto)
  const { error, value } = crearDonacionSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return sendError(res, 400, 'Datos de la donacion invalidos', error.details.map(d => d.message));
  }

  if (!req.file) {
    return sendError(res, 400, 'Debes adjuntar el comprobante de la transferencia (JPG, PNG o PDF)');
  }

  try {
    const datos = {
      ...value,
      comprobante_url: req.file.filename
    };
    const donacion = await donacionService.crearDonacion(datos);
    return sendSuccess(res, 201, 'Donacion registrada', donacion);
  } catch (error) {
    return manejarError(res, error);
  }
};

const obtenerDonaciones = async (req, res) => {
  try {
    const donaciones = await donacionService.obtenerDonaciones();
    return sendSuccess(res, 200, 'Donaciones obtenidas', donaciones);
  } catch (error) {
    return manejarError(res, error);
  }
};

const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const donacion = await donacionService.cambiarEstado(id, estado);
    return sendSuccess(res, 200, 'Estado actualizado', donacion);
  } catch (error) {
    return manejarError(res, error);
  }
};

module.exports = { crearDonacion, obtenerDonaciones, cambiarEstado };