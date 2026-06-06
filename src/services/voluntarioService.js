const bcrypt = require('bcryptjs');
const { UsuarioVoluntario } = require('../entities/VoluntarioModels');

const SALT_ROUNDS = 10;

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

const createVoluntario = async (payload) => {
  const [voluntarioExistentePorRut, voluntarioExistentePorEmail] = await Promise.all([
    UsuarioVoluntario.findOne({ where: { rut: payload.rut } }),
    UsuarioVoluntario.findOne({ where: { email: payload.email } })
  ]);

  if (voluntarioExistentePorRut) {
    throw buildError('Ya existe un voluntario con ese RUT', 409);
  }

  if (voluntarioExistentePorEmail) {
    throw buildError('Ya existe un voluntario con ese email', 409);
  }

  const passwd_hash = await bcrypt.hash(payload.password, SALT_ROUNDS);

  const nuevoVoluntario = await UsuarioVoluntario.create({
    rut: payload.rut,
    passwd_hash,
    nombre: payload.nombre,
    apellido: payload.apellido,
    email: payload.email,
    edad: payload.edad,
    contacto: payload.contacto,
    activo: payload.activo,
    clasificacion: payload.clasificacion,
    contacto_emergencia: payload.contacto_emergencia,
    rol_id: payload.rol_id
  });

  // Handling medical data if provided (assuming a separate creation or update)
  if (payload.id_datos_medicos !== undefined) {
    // In a real scenario, we would check if this medical record exists or create it.
    // For now, we follow the logic of the original service.
  }

  return sanitizeVoluntario(nuevoVoluntario);
};

const getAllVoluntarios = async ({ incluirInactivos = false } = {}) => {
  const where = incluirInactivos ? {} : { activo: true };
  const voluntarios = await UsuarioVoluntario.findAll({ where });

  return voluntarios.map(sanitizeVoluntario);
};

const getVoluntarioByRut = async (rut) => {
  const voluntario = await UsuarioVoluntario.findOne({ where: { rut } });
  if (!voluntario) {
    throw buildError('Voluntario no encontrado', 404);
  }

  return sanitizeVoluntario(voluntario);
};

const updateVoluntario = async (rut, payload) => {
  const voluntario = await UsuarioVoluntario.findOne({ where: { rut } });
  if (!voluntario) {
    throw buildError('Voluntario no encontrado', 404);
  }

  const dataToUpdate = { ...payload };

  if (dataToUpdate.password) {
    dataToUpdate.passwd_hash = await bcrypt.hash(dataToUpdate.password, SALT_ROUNDS);
    delete dataToUpdate.password;
  }

  if (dataToUpdate.email && dataToUpdate.email !== voluntario.email) {
    const voluntarioConEmail = await UsuarioVoluntario.findOne({ where: { email: dataToUpdate.email } });
    if (voluntarioConEmail && voluntarioConEmail.rut !== rut) {
      throw buildError('Ya existe un voluntario con ese email', 409);
    }
  }

  // Update the record
  await voluntario.update(dataToUpdate);

  return sanitizeVoluntario(voluntario);
};

const deleteVoluntario = async (rut) => {
  const voluntario = await UsuarioVoluntario.findOne({ where: { rut } });
  if (!voluntario) {
    throw buildError('Voluntario no encontrado', 404);
  }

  if (voluntario.activo === false) {
    return {
      ...sanitizeVoluntario(voluntario),
      yaEstabaInactivo: true
    };
  }

  await voluntario.update({ activo: false });

  return {
    ...sanitizeVoluntario(voluntario),
    yaEstabaInactivo: false
  };
};

module.exports = {
  createVoluntario,
  getAllVoluntarios,
  getVoluntarioByRut,
  updateVoluntario,
  deleteVoluntario
};
