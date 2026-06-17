const express = require('express');
const router = express.Router();
const familiaController = require('../controllers/familiaController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRole } = require('../middlewares/roleMiddleware');

// Roles con acceso completo
const ROLES_AUTORIZADOS = ['admin', 'coordinator', 'staff'];

// Ruta de prueba
router.get('/test', (req, res) => res.json({ message: 'Familia Router is working!' }));

// POST /familias — Registrar nueva familia
router.post('/', verifyToken, authorizeRole(...ROLES_AUTORIZADOS), familiaController.crearFamilia);

// GET /familias — Consultar todas las familias
router.get('/', verifyToken, authorizeRole(...ROLES_AUTORIZADOS), familiaController.obtenerTodasLasFamilias);

// GET /familias/:id — Consultar una familia por ID
router.get('/:id', verifyToken, authorizeRole(...ROLES_AUTORIZADOS), familiaController.obtenerFamiliaPorId);

// PATCH /familias/:id — Actualizar familia
router.patch('/:id', verifyToken, authorizeRole('admin', 'coordinator'), familiaController.actualizarFamilia);

// DELETE /familias/:id — Borrado lógico
router.delete('/:id', verifyToken, authorizeRole('admin'), familiaController.eliminarFamilia);

module.exports = router;

// QUE HACE ESTE CODIGO: Este código define las rutas para manejar las operaciones relacionadas con las familias en una aplicación
// Lo modifique para que solo los usuarios con rol de admin, coordinator y staff puedan crear, consultar y actualizar familias,
//  mientras que solo los usuarios con rol de admin pueden eliminar familias.
// Cada ruta está asociada a una función del controlador de familias que maneja la lógica de negocio para esa operación específica. 
// Por ejemplo, la ruta POST /familias llama a la función crearFamilia del controlador para crear una nueva familia en la base de datos. 
// La ruta GET /familias/:id permite obtener la información de una familia específica utilizando su ID como identificador. 
// La ruta PATCH /familias/:id se utiliza para actualizar la información de una familia existente, 
// y la ruta DELETE /familias/:id realiza un borrado lógico estableciendo el campo "activo" en false.