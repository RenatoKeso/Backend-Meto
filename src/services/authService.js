const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const configEnv = require('../config/configEnv');

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error('Correo o contraseña incorrectos');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Correo o contraseña incorrectos');

  const payload = { id: user.id, role: user.role };
  const token = jwt.sign(payload, configEnv.jwt.secret, { expiresIn: '2h' });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token
  };
};

const getMe = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) throw new Error('Usuario no encontrado');
  return { id: user.id, name: user.name, email: user.email, role: user.role };
};

module.exports = { login, getMe };

//QUE HACE ESTE CODIGO: Este código define un servicio de autenticación para una aplicación Node.js.
// El servicio tiene dos funciones principales: login y getMe.
// La función login maneja la autenticación del usuario, verificando el correo y la contraseña proporcionados, 
// y devuelve un token JWT si las credenciales son válidas.
// La función getMe devuelve la información del usuario autenticado utilizando su ID.