/**
 * Rutas de Voluntarios
 * Aquí definimos los endpoints relacionados con voluntarios
 */

const express = require("express");
const router = express.Router();
const voluntarioController = require("../controllers/voluntarioController");

router.get("/test", (req, res) =>
  res.json({ message: "Voluntario Router is working!" }),
);

// POST /voluntarios - Crear un nuevo voluntario
// ...

// POST /voluntarios - Crear un nuevo voluntario
router.post("/", voluntarioController.crearVoluntario);

// GET /voluntarios - Obtener todos los voluntarios
router.get("/", voluntarioController.obtenerTodosLosVoluntarios);

// GET /voluntarios/:rut - Obtener un voluntario por RUT
router.get("/:rut", voluntarioController.obtenerVoluntarioPorId);

// PATCH /voluntarios/:rut - Actualizar un voluntario
router.patch("/:rut", voluntarioController.actualizarVoluntario);

// DELETE /voluntarios/:rut - Borrado logico (activo = false)
router.delete("/:rut", voluntarioController.eliminarVoluntario);

// PATCH /voluntarios/:rut/capacidades - Completar/actualizar capacidades fisicas del voluntario
router.patch(
  "/:rut/capacidades",
  voluntarioController.actualizarCapacidadFisica,
);

// GET /voluntarios/:rut/actividades-disponibles - Actividades para las que el voluntario es elegible
router.get(
  "/:rut/actividades-disponibles",
  voluntarioController.obtenerActividadesDisponibles,
);

module.exports = router;
