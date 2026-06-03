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