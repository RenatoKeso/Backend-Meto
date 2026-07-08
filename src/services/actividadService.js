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

//Obtener todas las actividades
const ObtenerTodasLasActividades = async (usuarioAutenticado) => {
  const filtro = {};

  // Central ve las actividades de todas las cuadrillas; jefe de cuadrilla y
  // voluntario solo ven las de su propia cuadrilla.
  if (usuarioAutenticado.role !== "central") {
    filtro.id_cuadrilla = usuarioAutenticado.id_cuadrilla;
  }

  const actividades = await Actividad.findAll({
    where: filtro,
    order: [
      ["fecha", "ASC"],
      ["hora", "ASC"],
    ],
  });
  return actividades;
};

//  Obtener actividad por ID
const ObtenerActividadPorID = async (id, usuarioAutenticado) => {
  const actividad = await Actividad.findByPk(id);

  if (!actividad) {
    throw buildError("Actividad no encontrada", 404);
  }

  const esDeOtraCuadrilla = actividad.id_cuadrilla !== usuarioAutenticado.id_cuadrilla;
  if (usuarioAutenticado.role !== "central" && esDeOtraCuadrilla) {
    throw buildError("No tienes acceso a esta actividad", 403);
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