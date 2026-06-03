const jwt = require('jsonwebtoken');
const configEnv = require('../config/configEnv');

const verifyToken = (req, res, next) => {
  // Buscamos el token en el header Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
}

    try {
        const decoded = jwt.verify(token, configEnv.jwt.secret);
        req.user = decoded; // Guardamos los datos del usuario (id, role) en la petición
        next();
    } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

module.exports = { verifyToken };