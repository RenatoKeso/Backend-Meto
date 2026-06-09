const express = require('express');
const router = express.Router();
const donacionController = require('../controllers/donacionController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRole } = require('../middlewares/roleMiddleware');

// POST /donaciones - Cualquiera puede donar, no requiere token
router.post('/', donacionController.crearDonacion);

// GET /donaciones - Solo el administrador puede ver el historial
router.get('/', verifyToken, authorizeRole('admin'), donacionController.obtenerDonaciones);

module.exports = router;