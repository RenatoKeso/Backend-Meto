const { Actividad } = require("../entities/ActividadModels");

const buildError = (message, statusCode = 500, details = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (details) error.details = details;
  return error;
};
// crear actividad
const CrearActividad = async (payload) => {
  const {
    nombre,
    descripcion,
    fecha,
    hora,
    estado,
    id_usuario,
    id_cuadrilla,
    edad_minima,
    edad_maxima,
    movilidad_requerida,
    resistencia_requerida,
    capacidad_carga_requerida,
  } = payload;

  if (!nombre || !fecha || !hora) {
    throw buildError("El nombre, la fecha y la hora son obligatorios", 400);
  }

  if (!id_cuadrilla) {
    throw buildError("La cuadrilla es obligatoria", 400);
  }

  const nuevaActividad = await Actividad.create({
    nombre,
    descripcion,
    fecha,
    hora,
    estado: estado || "pendiente",
    id_usuario,
    id_cuadrilla,
    edad_minima: edad_minima ?? null,
    edad_maxima: edad_maxima ?? null,
    movilidad_requerida: movilidad_requerida ?? null,
    resistencia_requerida: resistencia_requerida ?? null,
    capacidad_carga_requerida: capacidad_carga_requerida ?? null,
  });

  return nuevaActividad;
};

// Obtener actividades. Si se pasa id_cuadrilla, solo trae las de esa cuadrilla
// (se usa para que jefe_cuadrilla/voluntario solo vean lo suyo; central manda null y ve todo)
const ObtenerTodasLasActividades = async (id_cuadrilla = null) => {
  const where = id_cuadrilla ? { id_cuadrilla } : {};

  const actividades = await Actividad.findAll({
    where,
    order: [
      ["fecha", "ASC"],
      ["hora", "ASC"],
    ],
  });
  return actividades;
};

//  Obtener actividad por ID
const ObtenerActividadPorID = async (id) => {
  const actividad = await Actividad.findByPk(id);

  if (!actividad) {
    throw buildError("Actividad no encontrada", 404);
  }

  return actividad;
};

//Modificar una actividad existente
const ModificarActividad = async (id, payload) => {
  const actividad = await Actividad.findByPk(id);

  if (!actividad) {
    throw buildError("Actividad no encontrada", 404);
  }

  const {
    nombre,
    descripcion,
    fecha,
    hora,
    estado,
    id_cuadrilla,
    edad_minima,
    edad_maxima,
    movilidad_requerida,
    resistencia_requerida,
    capacidad_carga_requerida,
  } = payload;

  if (!nombre || !fecha || !hora) {
    throw buildError("El nombre, la fecha y la hora son obligatorios", 400);
  }

  await actividad.update({
    nombre,
    descripcion,
    fecha,
    hora,
    estado,
    id_cuadrilla: id_cuadrilla ?? actividad.id_cuadrilla,
    edad_minima,
    edad_maxima,
    movilidad_requerida,
    resistencia_requerida,
    capacidad_carga_requerida,
  });

  return actividad;
};

//Eliminar una actividad
const EliminarActividad = async (id) => {
  const actividad = await Actividad.findByPk(id);

  if (!actividad) {
    throw buildError("Actividad no encontrada", 404);
  }

  await actividad.destroy();

  return { message: "Actividad eliminada correctamente" };
};

module.exports = {
  CrearActividad,
  ObtenerTodasLasActividades,
  ObtenerActividadPorID,
  ModificarActividad,
  EliminarActividad,
};