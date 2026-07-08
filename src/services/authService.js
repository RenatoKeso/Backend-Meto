const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const configEnv = require('../config/configEnv');
const { UsuarioVoluntario, Cuadrilla } = require('../entities/VoluntarioModels');

// Cruza el email del usuario del sistema con su perfil de voluntario (si tiene)
// para saber a qué cuadrilla pertenece y cuál es su RUT real. Se usa tanto en
// el login como en /me, para que ambos devuelvan siempre los mismos datos.
const obtenerDatosVoluntario = async (email) => {
  const voluntario = await UsuarioVoluntario.findOne({ where: { email } });

  if (!voluntario) {
    return { id_cuadrilla: null, rut: null, activo: null };
  }

  const result = { rut: voluntario.rut, activo: voluntario.activo };

  if (voluntario.id_cuadrilla) {
    result.id_cuadrilla = voluntario.id_cuadrilla;
  } else {
    const cuadrilla = await Cuadrilla.findOne({ where: { rut: voluntario.rut } });
    result.id_cuadrilla = cuadrilla ? cuadrilla.id_cuadrilla : null;
  }

  return result;
};

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error('Correo o contraseña incorrectos');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Correo o contraseña incorrectos');

  const datosVoluntario = await obtenerDatosVoluntario(user.email);

  const payload = {
    id: user.id,
    role: user.role,
    email: user.email,
    id_cuadrilla: datosVoluntario.id_cuadrilla,
    rut: datosVoluntario.rut
  };
  const token = jwt.sign(payload, configEnv.jwt.secret, { expiresIn: '2h' });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      id_cuadrilla: datosVoluntario.id_cuadrilla,
      rut: datosVoluntario.rut,
      activo: datosVoluntario.activo,
    },
    token
  };
};

const getMe = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) throw new Error('Usuario no encontrado');

  const datosVoluntario = await obtenerDatosVoluntario(user.email);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    id_cuadrilla: datosVoluntario.id_cuadrilla,
    rut: datosVoluntario.rut,
    activo: datosVoluntario.activo,
  };
};

const ROLES_VALIDOS = ['central', 'jefe_cuadrilla', 'voluntario'];

const assignRole = async (userId, newRole) => {
  if (!ROLES_VALIDOS.includes(newRole)) {
    throw new Error(`Rol inválido. Los roles permitidos son: ${ROLES_VALIDOS.join(', ')}`);
  }

  const updatedUser = await userRepository.updateRole(userId, newRole);
  if (!updatedUser) throw new Error('Usuario no encontrado');

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role
  };
};

module.exports = { login, getMe, assignRole };

//QUE HACE ESTE CODIGO: Este código define un servicio de autenticación para una aplicación Node.js.
// El servicio tiene dos funciones principales: login y getMe.
// La función login maneja la autenticación del usuario, verificando el correo y la contraseña proporcionados, 
// y devuelve un token JWT si las credenciales son válidas.
// La función getMe devuelve la información del usuario autenticado utilizando su ID.