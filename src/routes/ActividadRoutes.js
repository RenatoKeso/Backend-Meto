const express = require('express');
const actividadController = require('../controllers/actividadController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Todas las rutas requieren autenticación (verifyToken)
router.post('/',         verifyToken, actividadController.crearActividad);
router.get('/',          verifyToken, actividadController.ObtenerTodasLasActividades);
router.get('/:id',       verifyToken, actividadController.ObtenerActividadPorID);
router.put('/:id',       verifyToken, actividadController.ModificarActividad);
router.delete('/:id',    verifyToken, actividadController.EliminarActividad);

module.exports = router;