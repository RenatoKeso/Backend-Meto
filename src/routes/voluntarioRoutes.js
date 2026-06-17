/**
 * Rutas de Voluntarios
 * Aquí definimos los endpoints relacionados con voluntarios
 */

const express = require('express');
const router = express.Router();
const voluntarioController = require('../controllers/voluntarioController');

// Test route to verify the router is working
router.get('/test', (req, res) => res.json({ message: 'Voluntario Router is working!' }));

// POST /voluntarios - Crear un nuevo voluntario
// ...

// POST /voluntarios - Crear un nuevo voluntario
router.post('/', voluntarioController.crearVoluntario);

// GET /voluntarios - Obtener todos los voluntarios
router.get('/', voluntarioController.obtenerTodosLosVoluntarios);

// GET /voluntarios/:rut - Obtener un voluntario por RUT
router.get('/:rut', voluntarioController.obtenerVoluntarioPorId);

// PATCH /voluntarios/:rut - Actualizar un voluntario
router.patch('/:rut', voluntarioController.actualizarVoluntario);

// DELETE /voluntarios/:rut - Borrado logico (activo = false)
router.delete('/:rut', voluntarioController.eliminarVoluntario);

module.exports = router;

//QUE HACE ESTE CODIGO: Este código define las rutas para manejar las operaciones relacionadas con los voluntarios en una aplicación
// verifyToken se usa para proteger las rutas, lo que significa que solo los usuarios autenticados pueden acceder a estas rutas.
// authorizeRole se usa para restringir el acceso a ciertas rutas solo a usuarios con roles específicos, como 'admin' o 'Coordinador'.
// Cada ruta está asociada a una función del controlador de voluntarios que maneja la lógica de negocio para esa operación específica. 
// Por ejemplo, la ruta POST /voluntarios llama a la función crearVoluntario del controlador para crear un nuevo voluntario en la base de datos. 
// La ruta GET /voluntarios/:rut permite obtener la información de un voluntario específico utilizando su RUT como identificador. 
// La ruta PATCH /voluntarios/:rut se utiliza para actualizar la información de un voluntario existente, 
// y la ruta DELETE /voluntarios/:rut realiza un borrado lógico estableciendo el campo "activo" en false.
