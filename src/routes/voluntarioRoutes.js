const express = require('express');
const router = express.Router();
const voluntarioController = require('../controllers/voluntarioController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRole } = require('../middlewares/roleMiddleware');

// Test route to verify the router is working
router.get('/test', (req, res) => res.json({ message: 'Voluntario Router is working!' }));

// POST /voluntarios - Registro de postulación: queda público (no requiere token).
// Central revisa y activa la cuenta después mediante PATCH.
router.post('/', voluntarioController.crearVoluntario);

// GET /voluntarios - Central (validación de postulantes) y jefe de cuadrilla (lista de su equipo)
router.get('/', verifyToken, authorizeRole('central', 'jefe_cuadrilla'), voluntarioController.obtenerTodosLosVoluntarios);

// GET /voluntarios/:rut - Los 3 roles (el propio voluntario consulta sus datos)
router.get('/:rut', verifyToken, authorizeRole('central', 'jefe_cuadrilla', 'voluntario'), voluntarioController.obtenerVoluntarioPorId);

// PATCH /voluntarios/:rut - Central activa cuentas/evalúa habilidades; voluntario actualiza sus propios datos médicos
router.patch('/:rut', verifyToken, authorizeRole('central', 'voluntario'), voluntarioController.actualizarVoluntario);

// DELETE /voluntarios/:rut - Borrado logico (activo = false), solo central
router.delete('/:rut', verifyToken, authorizeRole('central'), voluntarioController.eliminarVoluntario);

module.exports = router;

//QUE HACE ESTE CODIGO: Define las rutas de voluntarios alineadas a los 3 roles reales de la fundación.
// El registro (POST) queda abierto porque es la postulación web; central la revisa y activa después.
// Central valida postulantes y administra voluntarios (GET todos, PATCH, DELETE).
// Jefe de cuadrilla ve la lista de su equipo (GET todos).
// Voluntario puede ver y actualizar su propio perfil (datos médicos, restricciones alimentarias).
