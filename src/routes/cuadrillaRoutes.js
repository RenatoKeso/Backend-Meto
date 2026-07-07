const express = require('express');
const router = express.Router();
const cuadrillaController = require('../controllers/cuadrillaController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRole } = require('../middlewares/roleMiddleware');

router.post('/', verifyToken, authorizeRole('central'), cuadrillaController.crearCuadrilla);
router.get('/', verifyToken, authorizeRole('central', 'jefe_cuadrilla'), cuadrillaController.obtenerTodasLasCuadrillas);
router.get('/:id', verifyToken, authorizeRole('central', 'jefe_cuadrilla'), cuadrillaController.obtenerCuadrillaPorId);
router.post('/:id/voluntarios', verifyToken, authorizeRole('central'), cuadrillaController.asignarVoluntario);
router.delete('/voluntarios/:rut', verifyToken, authorizeRole('central'), cuadrillaController.quitarVoluntario);

module.exports = router;
