/**
 * Rutas de Familias Beneficiadas
 * Define los endpoints del módulo de familias con control de acceso por rol
 */
const express = require('express');
const router = express.Router();
const familiaController = require('../controllers/familiaController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRole } = require('../middlewares/roleMiddleware');
 
// Roles con acceso completo (modificar y eliminar)
// Coordinador General y Coordinador Zonal son los autorizados
const ROLES_AUTORIZADOS = ['ROL_GEN', 'ROL_ZON', 'admin'];
 
// ─────────────────────────────────────────────
// Ruta de prueba
// ─────────────────────────────────────────────
router.get('/test', (req, res) => res.json({ message: 'Familia Router is working!' }));
 
// ─────────────────────────────────────────────
// POST /familias — Registrar nueva familia
// Requiere autenticación (cualquier usuario del personal)
// ─────────────────────────────────────────────
router.post('/', verifyToken, familiaController.crearFamilia);
 
// ─────────────────────────────────────────────
// GET /familias — Consultar todas las familias
// Requiere autenticación (cualquier usuario del personal)
// ─────────────────────────────────────────────
router.get('/', verifyToken, familiaController.obtenerTodasLasFamilias);
 
// ─────────────────────────────────────────────
// GET /familias/:id — Consultar una familia por ID
// Requiere autenticación (cualquier usuario del personal)
// ─────────────────────────────────────────────
router.get('/:id', verifyToken, familiaController.obtenerFamiliaPorId);
 
// ─────────────────────────────────────────────
// PATCH /familias/:id — Actualizar familia
// RESTRINGIDO: solo roles autorizados
// ─────────────────────────────────────────────
router.patch('/:id', verifyToken, authorizeRole(...ROLES_AUTORIZADOS), familiaController.actualizarFamilia);
 
// ─────────────────────────────────────────────
// DELETE /familias/:id — Borrado lógico de familia
// RESTRINGIDO: solo roles autorizados
// ─────────────────────────────────────────────
router.delete('/:id', verifyToken, authorizeRole(...ROLES_AUTORIZADOS), familiaController.eliminarFamilia);
 
module.exports = router;
 

