const express = require('express');
const router = express.Router();
const familiaController = require('../controllers/familiaController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRole } = require('../middlewares/roleMiddleware');

// Los 3 roles pueden consultar
const ROLES_CONSULTA = ['central', 'jefe_cuadrilla', 'voluntario'];

// Ruta de prueba
router.get('/test', (req, res) => res.json({ message: 'Familia Router is working!' }));

// POST /familias — Registrar nueva familia (solo central)
router.post('/', verifyToken, authorizeRole('central','jefe_cuadrilla'), familiaController.crearFamilia);

// GET /familias — Consultar todas las familias (los 3 roles)
router.get('/', verifyToken, authorizeRole(...ROLES_CONSULTA), familiaController.obtenerTodasLasFamilias);

// GET /familias/:id — Consultar una familia por ID (los 3 roles)
router.get('/:id', verifyToken, authorizeRole(...ROLES_CONSULTA), familiaController.obtenerFamiliaPorId);

// PATCH /familias/:id — Actualizar familia (central y jefe_cuadrilla)
router.patch('/:id', verifyToken, authorizeRole('central','jefe_cuadrilla'), familiaController.actualizarFamilia);

// DELETE /familias/:id — Borrado lógico (solo central)
router.delete('/:id', verifyToken, authorizeRole('central'), familiaController.eliminarFamilia);

module.exports = router;

// QUE HACE ESTE CODIGO: Define las rutas de familias beneficiadas.
// Los 3 roles (central, jefe_cuadrilla, voluntario) pueden consultar familias.
// Solo el rol central puede crear, actualizar y eliminar registros de familias.