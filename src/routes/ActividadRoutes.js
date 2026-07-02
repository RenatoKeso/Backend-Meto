const express = require('express');
const actividadController = require('../controllers/actividadController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRole } = require('../middlewares/roleMiddleware');

const router = express.Router();

// POST - Central y jefe de cuadrilla pueden crear actividades
router.post('/', verifyToken, authorizeRole('central', 'jefe_cuadrilla'), actividadController.crearActividad);

// GET todas - Los 3 roles pueden ver
router.get('/', verifyToken, authorizeRole('central', 'jefe_cuadrilla', 'voluntario'), actividadController.ObtenerTodasLasActividades);

// GET por id - Los 3 roles pueden ver
router.get('/:id', verifyToken, authorizeRole('central', 'jefe_cuadrilla', 'voluntario'), actividadController.ObtenerActividadPorID);

// PUT - Central y jefe de cuadrilla pueden modificar (jefe de cuadrilla registra hitos/tiempos de su obra)
router.put('/:id', verifyToken, authorizeRole('central', 'jefe_cuadrilla'), actividadController.ModificarActividad);

// DELETE - Solo central puede eliminar
router.delete('/:id', verifyToken, authorizeRole('central'), actividadController.EliminarActividad);

module.exports = router;

//QUE HACE ESTE CODIGO: Este código define las rutas para manejar las operaciones relacionadas con las actividades en una aplicación
// Lo modifique para que solo los usuarios con rol de admin y coordinator puedan crear, modificar y eliminar actividades,
//  mientras que los roles de staff y volunteer solo pueden ver las actividades.
// Cada ruta está asociada a una función del controlador de actividades que maneja la lógica de negocio para esa operación específica. 
// Por ejemplo, la ruta POST /actividades llama a la función crearActividad del controlador para crear una nueva actividad en la base de datos. 
// La ruta GET /actividades/:id permite obtener la información de una actividad específica utilizando su ID como identificador. 
// y la ruta DELETE /actividades/:id elimina una actividad de la base de datos.