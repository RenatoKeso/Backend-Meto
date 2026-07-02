/**
 * Servicio de elegibilidad
 * Determina si un voluntario cumple los requisitos definidos en una actividad
 * (edad y niveles de capacidad física: movilidad, resistencia y capacidad de carga).
 */

const { UsuarioVoluntario, CapacidadFisica } = require('../entities/VoluntarioModels');

const NIVELES = { baja: 1, media: 2, alta: 3 };

const cumpleNivel = (nivelVoluntario, nivelRequerido) => {
  if (!nivelRequerido) {
    return true; // la actividad no exige un nivel para esta capacidad
  }

  if (!nivelVoluntario) {
    return false; // la actividad exige un nivel, pero el voluntario no lo ha registrado
  }

  return NIVELES[nivelVoluntario] >= NIVELES[nivelRequerido];
};

const cumpleEdad = (edadVoluntario, edadMinima, edadMaxima) => {
  if (edadMinima !== null && edadMinima !== undefined && edadVoluntario < edadMinima) {
    return false;
  }

  if (edadMaxima !== null && edadMaxima !== undefined && edadVoluntario > edadMaxima) {
    return false;
  }

  return true;
};

/**
 * @param {object} voluntario Instancia (o JSON) de UsuarioVoluntario, con la asociación 'capacidad_fisica' cargada
 * @param {object} actividad Instancia (o JSON) de Actividad
 * @returns {boolean}
 */
const esVoluntarioElegible = (voluntario, actividad) => {
  if (!voluntario || !voluntario.activo) {
    return false;
  }

  if (!cumpleEdad(voluntario.edad, actividad.edad_minima, actividad.edad_maxima)) {
    return false;
  }

  const capacidad = voluntario.capacidad_fisica || {};

  if (!cumpleNivel(capacidad.movilidad, actividad.movilidad_requerida)) {
    return false;
  }

  if (!cumpleNivel(capacidad.resistencia_fisica, actividad.resistencia_requerida)) {
    return false;
  }

  if (!cumpleNivel(capacidad.capacidad_carga, actividad.capacidad_carga_requerida)) {
    return false;
  }

  return true;
};

/**
 * Obtiene los voluntarios activos que cumplen los requisitos de la actividad indicada.
 * @param {object} actividad Instancia de Actividad
 */
const getVoluntariosElegibles = async (actividad) => {
  const voluntarios = await UsuarioVoluntario.findAll({
    where: { activo: true },
    include: [{ model: CapacidadFisica, as: 'capacidad_fisica' }]
  });

  return voluntarios.filter((voluntario) => esVoluntarioElegible(voluntario, actividad));
};

module.exports = {
  NIVELES,
  esVoluntarioElegible,
  getVoluntariosElegibles
};
