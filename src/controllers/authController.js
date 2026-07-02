const authService = require('../services/authService');

const login = async (req, res) => {
try {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'El correo y la contraseña son obligatorios' });
    }

    const data = await authService.login(email, password);
    return res.status(200).json(data);
} catch (error) {
    return res.status(401).json({ message: error.message });
    }
};

const me = async (req, res) => {
try {
    const data = await authService.getMe(req.user.id);
    return res.status(200).json(data);
} catch (error) {
    return res.status(404).json({ message: error.message });
    }
};

const logout = (req, res) => {
    return res.status(200).json({ message: 'Sesión cerrada correctamente.' });
};

module.exports = { login, me, logout };

//QUE HACE ESTE CODIGO: Este código define un controlador de autenticación para una aplicación Node.js.
// El controlador tiene tres funciones principales: login, me y logout.
// La función login maneja la autenticación del usuario, verificando el correo y la contraseña proporcionados, 
// y devuelve un token JWT si las credenciales son válidas.
// La función "me" devuelve la información del usuario autenticado utilizando el ID almacenado en el token JWT.
// La función logout simplemente devuelve un mensaje de éxito, ya que en una implementación basada en JWT, no es necesario invalidar el token en el servidor.