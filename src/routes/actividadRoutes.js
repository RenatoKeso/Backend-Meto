const express = require("express");
const actividadController = require("../controllers/actividadController");
const postulacionController = require("../controllers/postulacionController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/roleMiddleware");

const router = express.Router();

// Roles de la organización habilitados para gestionar requisitos y asignaciones de voluntarios
const ROLES_ORGANIZACION = ["central", "jefe_cuadrilla"];

// Todas las rutas requieren autenticación (verifyToken)
router.post("/", verifyToken, actividadController.crearActividad);
router.get("/", verifyToken, actividadController.ObtenerTodasLasActividades);
router.get("/:id", verifyToken, actividadController.ObtenerActividadPorID);
router.put("/:id", verifyToken, actividadController.ModificarActividad);
router.delete("/:id", verifyToken, actividadController.EliminarActividad);

// GET /actividades/:id/voluntarios-elegibles - Voluntarios activos que cumplen los requisitos de la actividad (organización)
router.get(
  "/:id/voluntarios-elegibles",
  verifyToken,
  authorizeRole(...ROLES_ORGANIZACION),
  postulacionController.obtenerVoluntariosElegibles,
);

// GET /actividades/:id/postulantes - Voluntarios que se postularon/aceptaron o fueron asignados (organización)
router.get(
  "/:id/postulantes",
  verifyToken,
  authorizeRole(...ROLES_ORGANIZACION),
  postulacionController.listarPostulantes,
);

// POST /actividades/:id/postular - El voluntario se postula o acepta la invitación (solo si es elegible)
router.post("/:id/postular", postulacionController.postularOAceptar);

// POST /actividades/:id/asignar - Asignación definitiva del voluntario a la actividad (organización)
router.post(
  "/:id/asignar",
  verifyToken,
  authorizeRole(...ROLES_ORGANIZACION),
  postulacionController.asignarVoluntario,
);

module.exports = router;
