const bcrypt = require("bcryptjs");
const {
  UsuarioVoluntario,
  CapacidadFisica,
} = require("../entities/VoluntarioModels");
const userRepository = require("../repositories/userRepository");

const SALT_ROUNDS = 10;

// Mapeo entre el rol de negocio (cargo dentro de la organización, guardado
// en rol_id) y el rol de sistema (permisos de la app, guardado en users.role).
// Definido junto al usuario: coordinadores -> central, jefe de cuadrilla ->
// jefe_cuadrilla, el resto -> voluntario.
const ROL_A_SISTEMA = {
  ROL_CEN: "central",
  ROL_JEF: "jefe_cuadrilla",
  ROL_VOL: "voluntario",
  ROL_OTR: "voluntario",
};

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
  const [voluntarioExistentePorRut, voluntarioExistentePorEmail] =
    await Promise.all([
      UsuarioVoluntario.findOne({ where: { rut: payload.rut } }),
      UsuarioVoluntario.findOne({ where: { email: payload.email } }),
    ]);

  if (voluntarioExistentePorRut) {
    throw buildError("Ya existe un voluntario con ese RUT", 409);
  }

  if (voluntarioExistentePorEmail) {
    throw buildError("Ya existe un voluntario con ese email", 409);
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
    rol_id: payload.rol_id,
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
  const voluntarios = await UsuarioVoluntario.findAll({
    where,
    include: [{ model: CapacidadFisica, as: "capacidad_fisica" }],
  });

  return voluntarios.map(sanitizeVoluntario);
};

const getVoluntarioByRut = async (rut) => {
  const voluntario = await UsuarioVoluntario.findOne({
    where: { rut },
    include: [{ model: CapacidadFisica, as: "capacidad_fisica" }],
  });
  if (!voluntario) {
    throw buildError("Voluntario no encontrado", 404);
  }

  return sanitizeVoluntario(voluntario);
};

const updateVoluntario = async (rut, payload) => {
  const voluntario = await UsuarioVoluntario.findOne({ where: { rut } });
  if (!voluntario) {
    throw buildError("Voluntario no encontrado", 404);
  }

  const dataToUpdate = { ...payload };
  const emailAnterior = voluntario.email;
  let nuevoPasswdHash = null;

  if (dataToUpdate.password) {
    nuevoPasswdHash = await bcrypt.hash(
      dataToUpdate.password,
      SALT_ROUNDS,
    );
    dataToUpdate.passwd_hash = nuevoPasswdHash;
    delete dataToUpdate.password;
  }

  if (dataToUpdate.email && dataToUpdate.email !== voluntario.email) {
    const voluntarioConEmail = await UsuarioVoluntario.findOne({
      where: { email: dataToUpdate.email },
    });
    if (voluntarioConEmail && voluntarioConEmail.rut !== rut) {
      throw buildError("Ya existe un voluntario con ese email", 409);
    }
  }

  // Update the record
  await voluntario.update(dataToUpdate);

  // Si el voluntario ya tiene una cuenta de acceso en `users` (fue activado),
  // se mantiene sincronizada con el email/contraseña nuevos para que el login
  // no quede con datos desactualizados.
  const usuarioSistema = await userRepository.findByEmail(emailAnterior);
  if (usuarioSistema) {
    if (dataToUpdate.email) usuarioSistema.email = dataToUpdate.email;
    if (nuevoPasswdHash) usuarioSistema.password = nuevoPasswdHash;
    if (dataToUpdate.email || nuevoPasswdHash) await usuarioSistema.save();
  }

  return sanitizeVoluntario(voluntario);
};

const deleteVoluntario = async (rut) => {
  const voluntario = await UsuarioVoluntario.findOne({ where: { rut } });
  if (!voluntario) {
    throw buildError("Voluntario no encontrado", 404);
  }

  if (voluntario.activo === false) {
    return {
      ...sanitizeVoluntario(voluntario),
      yaEstabaInactivo: true,
    };
  }

  await voluntario.update({ activo: false });

  return {
    ...sanitizeVoluntario(voluntario),
    yaEstabaInactivo: false,
  };
};

/**
 * Crea o actualiza las capacidades físicas (movilidad, resistencia y capacidad de carga)
 * del voluntario. Estos datos son complementarios y se completan/actualizan luego del registro.
 */
const actualizarCapacidadFisica = async (rut, payload) => {
  const voluntario = await UsuarioVoluntario.findOne({ where: { rut } });
  if (!voluntario) {
    throw buildError("Voluntario no encontrado", 404);
  }

  if (voluntario.id_capacidad_fisica) {
    const capacidadExistente = await CapacidadFisica.findByPk(
      voluntario.id_capacidad_fisica,
    );
    await capacidadExistente.update(payload);
  } else {
    const nuevaCapacidad = await CapacidadFisica.create(payload);
    await voluntario.update({
      id_capacidad_fisica: nuevaCapacidad.id_capacidad_fisica,
    });
  }

  await voluntario.reload({
    include: [{ model: CapacidadFisica, as: "capacidad_fisica" }],
  });

  return sanitizeVoluntario(voluntario);
};

const activarVoluntario = async (rut, rol_id) => {
  const voluntario = await UsuarioVoluntario.findOne({ where: { rut } });
  if (!voluntario) {
    throw buildError('Voluntario no encontrado', 404);
  }

  await voluntario.update({ activo: true, rol_id });

  const roleSistema = ROL_A_SISTEMA[rol_id] || 'voluntario';

  // Crea o actualiza la fila correspondiente en la tabla `users`, que es
  // la que realmente usa authService para el login y el control de permisos.
  // Se reutiliza el mismo passwd_hash (bcrypt) para no pedirle de nuevo la
  // contraseña al voluntario.
  const usuarioExistente = await userRepository.findByEmail(voluntario.email);
  if (usuarioExistente) {
    usuarioExistente.role = roleSistema;
    await usuarioExistente.save();
  } else {
      await userRepository.crearConPasswordHasheada({
      name: `${voluntario.nombre} ${voluntario.apellido}`,
      email: voluntario.email,
      password: voluntario.passwd_hash,
      role: roleSistema,
    });
  }

  return sanitizeVoluntario(voluntario);
};

module.exports = {
  createVoluntario,
  getAllVoluntarios,
  getVoluntarioByRut,
  updateVoluntario,
  deleteVoluntario,
  actualizarCapacidadFisica,
  activarVoluntario
};
