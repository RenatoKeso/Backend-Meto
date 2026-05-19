const authService = require('../services/authService');

const login = async (req, res) => {
    try {
    // Obtenemos los datos que envía el usuario (ej. desde un formulario de React o Postman)
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'El correo y la contraseña son obligatorios' });
    }

    // Llamamos a nuestro servicio
    const data = await authService.login(email, password);
    
    // Si todo sale bien, devolvemos un 200 OK con el usuario y el token
    return res.status(200).json(data);
} catch (error) {
    // Si la contraseña está mal o el usuario no existe, devolvemos un 401 Unauthorized
    return res.status(401).json({ message: error.message });
    }
};

module.exports = {
    login
};