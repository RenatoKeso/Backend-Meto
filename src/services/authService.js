const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const configEnv = require('../config/configEnv');

const login = async (email, password) => {
  // 1. Buscar al usuario en la base de datos por su correo
    const user = await userRepository.findByEmail(email);
    if (!user) {
    throw new Error('Correo o contraseña incorrectos');
}

  // 2. Comparar la contraseña ingresada con la encriptada en la BD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
    throw new Error('Correo o contraseña incorrectos');
}

  // 3. Crear el "pasaporte" o Token (Guardamos su ID y su Rol)
    const payload = {
    id: user.id,
    role: user.role
};

  // El token durará 2 horas
    const token = jwt.sign(payload, configEnv.jwt.secret, { expiresIn: '2h' });

  // 4. Devolvemos la info del usuario (sin la contraseña) y su token
    return {
    user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
    },
    token
    };
};

module.exports = {
    login
};