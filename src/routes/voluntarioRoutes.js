/**
 * Rutas de Voluntarios
 * Aquí definimos los endpoints relacionados con voluntarios
 */

const express = require('express');
const router = express.Router();
const voluntarioController = require('../controllers/voluntarioController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRole } = require('../middlewares/roleMiddleware');

// Test route to verify the router is working
router.get('/test', (req, res) => res.json({ message: 'Voluntario Router is working!' }));

// POST /voluntarios - Crear un nuevo voluntario
router.post('/', voluntarioController.crearVoluntario);

// GET /voluntarios - Solo central
router.get('/', verifyToken, authorizeRole('central'), voluntarioController.obtenerTodosLosVoluntarios);

// GET /voluntarios/:rut - Obtener un voluntario por RUT
router.get('/:rut', voluntarioController.obtenerVoluntarioPorId);

// PATCH /voluntarios/:rut - Actualizar un voluntario
router.patch('/:rut', voluntarioController.actualizarVoluntario);

// DELETE /voluntarios/:rut - Borrado logico (activo = false)
router.delete('/:rut', voluntarioController.eliminarVoluntario);

module.exports = router;
