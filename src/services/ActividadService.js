const { Actividad } = require('../entities/ActividadModels');

const buildError = (message, statusCode = 500, details = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (details) error.details = details;
  return error;
};
// crear actividad
const CrearActividad = async (payload) => {
  const { nombre, descripcion, fecha, hora, estado, id_usuario } = payload;

  if (!nombre || !fecha || !hora) {
    throw buildError('El nombre, la fecha y la hora son obligatorios', 400);
  }

  const nuevaActividad = await Actividad.create({
    nombre,
    descripcion,
    fecha,
    hora,
    estado: estado || 'pendiente',
    id_usuario,
  });

  return nuevaActividad;
};


//Obtener todas las actividades
const ObtenerTodasLasActividades = async () => {
  const actividades = await Actividad.findAll({
    order: [['fecha', 'ASC'], ['hora', 'ASC']],
  });
  return actividades;
};

//  Obtener actividad por ID
const ObtenerActividadPorID = async (id) => {
  const actividad = await Actividad.findByPk(id);

  if (!actividad) {
    throw buildError('Actividad no encontrada', 404);
  }

  return actividad;
};

//Modificar una actividad existente
const ModificarActividad = async (id, payload) => {
  const actividad = await Actividad.findByPk(id);

  if (!actividad) {
    throw buildError('Actividad no encontrada', 404);
  }

  const { nombre, descripcion, fecha, hora, estado } = payload;

  if (!nombre || !fecha || !hora) {
    throw buildError('El nombre, la fecha y la hora son obligatorios', 400);
  }

  await actividad.update({ nombre, descripcion, fecha, hora, estado });

  return actividad;
};

//Eliminar una actividad
const EliminarActividad = async (id) => {
  const actividad = await Actividad.findByPk(id);

  if (!actividad) {
    throw buildError('Actividad no encontrada', 404);
  }

  await actividad.destroy();

  return { message: 'Actividad eliminada correctamente' };
};

module.exports = {
  CrearActividad,
  ObtenerTodasLasActividades,
  ObtenerActividadPorID,
  ModificarActividad,
  EliminarActividad,
};