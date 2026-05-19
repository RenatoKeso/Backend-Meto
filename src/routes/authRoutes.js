const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Creamos la ruta POST para iniciar sesión
router.post('/login', authController.login);

module.exports = router;