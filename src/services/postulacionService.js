/**
 * Servicio de Postulaciones a Actividades
 * Gestiona el flujo: voluntario elegible -> postula/acepta -> organización asigna
 */

const { Actividad } = require('../entities/ActividadModels');
const { UsuarioVoluntario, CapacidadFisica } = require('../entities/VoluntarioModels');
const { PostulacionActividad } = require('../entities/PostulacionModels');
const { esVoluntarioElegible, getVoluntariosElegibles } = require('./elegibilidadService');

const buildError = (message, statusCode = 500, details = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (details) {
    error.details = details;
  }
  return error;
};

const sanitizeVoluntario = (voluntario) => {
  if (!voluntario) {
    return null;
  }
  const data = voluntario.toJSON ? voluntario.toJSON() : { ...voluntario };
  delete data.passwd_hash;
  return data;
};

const getActividadPorId = async (idActividad) => {
  const actividad = await Actividad.findByPk(idActividad);
  if (!actividad) {
    throw buildError('Actividad no encontrada', 404);
  }
  return actividad;
};

const getVoluntarioConCapacidad = async (rut) => {
  const voluntario = await UsuarioVoluntario.findOne({
    where: { rut },
    include: [{ model: CapacidadFisica, as: 'capacidad_fisica' }]
  });

  if (!voluntario) {
    throw buildError('Voluntario no encontrado', 404);
  }

  return voluntario;
};

/**
 * Lista las actividades para las que el voluntario es elegible y aún no se ha postulado.
 */
const getActividadesDisponibles = async (rut) => {
  const voluntario = await getVoluntarioConCapacidad(rut);

  if (!voluntario.activo) {
    throw buildError('El voluntario no está activo', 403);
  }

  const actividades = await Actividad.findAll({ where: { estado: 'pendiente' } });
  const elegibles = actividades.filter((actividad) => esVoluntarioElegible(voluntario, actividad));

  if (elegibles.length === 0) {
    return [];
  }

  const postulacionesExistentes = await PostulacionActividad.findAll({
    where: {
      rut_voluntario: rut,
      id_actividad: elegibles.map((actividad) => actividad.id_actividad)
    }
  });
  const idsYaPostulados = new Set(postulacionesExistentes.map((postulacion) => postulacion.id_actividad));

  return elegibles.filter((actividad) => !idsYaPostulados.has(actividad.id_actividad));
};

/**
 * El voluntario se postula o acepta la invitación a una actividad.
 * Solo es posible si cumple los requisitos definidos por la actividad.
 */
const postularOAceptar = async (rut, idActividad) => {
  const voluntario = await getVoluntarioConCapacidad(rut);

  if (!voluntario.activo) {
    throw buildError('El voluntario no está activo', 403);
  }

  const actividad = await getActividadPorId(idActividad);

  if (!esVoluntarioElegible(voluntario, actividad)) {
    throw buildError('El voluntario no cumple los requisitos definidos para esta actividad', 403);
  }

  const postulacionExistente = await PostulacionActividad.findOne({
    where: { id_actividad: idActividad, rut_voluntario: rut }
  });

  if (postulacionExistente) {
    throw buildError('El voluntario ya se encuentra postulado o asignado a esta actividad', 409);
  }

  const nuevaPostulacion = await PostulacionActividad.create({
    id_actividad: idActividad,
    rut_voluntario: rut,
    estado: 'postulado',
    fecha_postulacion: new Date()
  });

  return nuevaPostulacion;
};

/**
 * Lista los voluntarios que se han postulado/aceptado o han sido asignados a una actividad.
 */
const listarPostulantes = async (idActividad) => {
  await getActividadPorId(idActividad);

  const postulaciones = await PostulacionActividad.findAll({
    where: { id_actividad: idActividad },
    include: [{ model: UsuarioVoluntario, as: 'voluntario' }]
  });

  return postulaciones.map((postulacion) => {
    const data = postulacion.toJSON();
    if (data.voluntario) {
      delete data.voluntario.passwd_hash;
    }
    return data;
  });
};

/**
 * Obtiene los voluntarios activos que cumplen los requisitos de la actividad (elegibles),
 * sin importar si ya se postularon o no.
 */
const obtenerVoluntariosElegibles = async (idActividad) => {
  const actividad = await getActividadPorId(idActividad);
  const elegibles = await getVoluntariosElegibles(actividad);
  return elegibles.map(sanitizeVoluntario);
};

/**
 * Asignación definitiva del voluntario a la actividad, realizada por la organización.
 * Solo procede si el voluntario ya confirmó su disponibilidad (postulado).
 */
const asignarVoluntario = async (idActividad, rut, asignadoPor) => {
  await getActividadPorId(idActividad);

  const postulacion = await PostulacionActividad.findOne({
    where: { id_actividad: idActividad, rut_voluntario: rut }
  });

  if (!postulacion) {
    throw buildError('El voluntario debe postular o aceptar la actividad antes de poder ser asignado', 404);
  }

  if (postulacion.estado === 'asignado') {
    throw buildError('El voluntario ya se encuentra asignado a esta actividad', 409);
  }

  if (postulacion.estado === 'rechazado') {
    throw buildError('No es posible asignar una postulación que fue rechazada', 409);
  }

  await postulacion.update({
    estado: 'asignado',
    fecha_asignacion: new Date(),
    asignado_por: asignadoPor || null
  });

  return postulacion;
};

module.exports = {
  getActividadesDisponibles,
  postularOAceptar,
  listarPostulantes,
  obtenerVoluntariosElegibles,
  asignarVoluntario
};
