const express = require('express');
const router = express.Router();
const voluntarioController = require('../controllers/voluntarioController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRole } = require('../middlewares/roleMiddleware');

// POST /voluntarios - Registro de postulación: queda público (no requiere token).
// Central revisa y activa la cuenta después mediante PATCH.
router.post('/', voluntarioController.crearVoluntario);

// GET /voluntarios - Solo central
router.get('/', verifyToken, authorizeRole('central'), voluntarioController.obtenerTodosLosVoluntarios);

// GET /voluntarios/:rut - Los 3 roles (el propio voluntario consulta sus datos)
router.get('/:rut', verifyToken, authorizeRole('central', 'jefe_cuadrilla', 'voluntario'), voluntarioController.obtenerVoluntarioPorId);

// PATCH /voluntarios/:rut - Central activa cuentas/evalúa habilidades; voluntario actualiza sus propios datos médicos
router.patch('/:rut', verifyToken, authorizeRole('central', 'voluntario'), voluntarioController.actualizarVoluntario);

// PATCH /voluntarios/:rut/activar - Central revisa la postulación, activa la cuenta y asigna el rol_id
router.patch('/:rut/activar', verifyToken, authorizeRole('central'), voluntarioController.activarVoluntario);

// DELETE /voluntarios/:rut - Borrado logico (activo = false), solo central
router.delete('/:rut', verifyToken, authorizeRole('central'), voluntarioController.eliminarVoluntario);

// PATCH /voluntarios/:rut/capacidades - Completar/actualizar capacidades físicas del voluntario (identificado por :rut)
router.patch('/:rut/capacidades', voluntarioController.actualizarCapacidadFisica);

// GET /voluntarios/:rut/actividades-disponibles - Actividades para las que el voluntario es elegible (identificado por :rut)
router.get('/:rut/actividades-disponibles', voluntarioController.obtenerActividadesDisponibles);

module.exports = router;
