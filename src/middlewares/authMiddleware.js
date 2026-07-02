const jwt = require('jsonwebtoken');
const configEnv = require('../config/configEnv');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
}

try {
    const decoded = jwt.verify(token, configEnv.jwt.secret);
    req.user = decoded;
    next();
} catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
}
};

module.exports = { verifyToken };

//QUE HACE ESTE CODIGO: Este código define un middleware de autenticación para una aplicación Node.js utilizando JSON Web Tokens (JWT). 
// El middleware verifica si el token JWT está presente en la cabecera de autorización de la solicitud, lo decodifica y, si es válido, permite que la solicitud continúe. 
// Si el token no es proporcionado o es inválido, devuelve un error de acceso denegado.
//Si el token es valido, guarda el rol y el id para usarlos en otra función
//Si no hay token arroja el error 401 con el mensaje "Acceso denegado. Token no proporcionado."

