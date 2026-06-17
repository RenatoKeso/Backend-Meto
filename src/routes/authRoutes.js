const express = require('express');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', authController.login);
router.get('/me', verifyToken, authController.me);
router.post('/logout', verifyToken, authController.logout);

module.exports = router;

//Este archivo define las rutas de autenticación para la aplicación.
// /me devuelve la información del usuario autenticado, y requiere un token válido para acceder.
// /logout cierra la sesión del usuario autenticado, también requiere un token válido para acceder.
// Ambas son protegidas por el middleware de autenticación verifyToken
//  lo que significa que solo los usuarios autenticados pueden acceder a estas rutas.