 GET /api/actividades devuelve TODAS las actividades de TODAS las cuadrillas, a cualquier usuario autenticado.
 - no hay ningún filtro por id_cuadrilla en ObtenerTodasLasActividades (ni en el service ni en el controller). Mismo problema en GET /:id: cualquiera con token puede pedir el detalle de una actividad de otra cuadrilla

Crear, modificar y eliminar no tienen control de rol ni de cuadrilla — solo piden estar logueado.
- actividadRoutes.js, POST /, PUT /:id y DELETE /:id solo tienen verifyToken, sin authorizeRole y sin chequear que el usuario pertenezca a esa cuadrilla.

