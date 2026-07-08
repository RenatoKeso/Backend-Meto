cambia# Auditoría de Requisitos — Backend-Meto

**Fecha:** 2026-07-07
**Rama:** `integracion-gestion_voluntarios` (merge con `origin/main` incluido)

---

## Resumen

| Clasificación | Cantidad |
|---|---|
| 🔴 Crítico | 9 |
| 🟠 Alto | 6 |
| 🟡 Medio | 2 |
| 🔵 Bajo | 2 |
| 🟢 Cumple | 34 |
| **Total** | **53** |

**Progreso:** 14 hallazgos corregidos respecto a la auditoría anterior (gracias al merge con `origin/main` que trajo donaciones completas, cuadrillas, CORS, validación de dirección y más).

---

## Hallazgos

| # | Requisito | Problema | Severidad | Archivo | Línea |
|---|---|---|---|---|---|
| 1 | REQ-ROL-05 | `PATCH /:rut/capacidades` sin `verifyToken` — cualquiera que conozca un RUT modifica capacidades | 🔴 Crítico | `src/routes/voluntarioRoutes.js` | 27 |
| 2 | REQ-ROL-05 | `GET /:rut/actividades-disponibles` sin `verifyToken` — expone elegibilidad sin auth | 🔴 Crítico | `src/routes/voluntarioRoutes.js` | 30 |
| 3 | REQ-ROL-05 | `POST /actividades/:id/postular` sin `verifyToken` — cualquiera postula con solo el RUT | 🔴 Crítico | `src/routes/actividadRoutes.js` | 36 |
| 4 | REQ-ACT-05 | `ObtenerTodasLasActividades` no filtra por cuadrilla del usuario autenticado | 🔴 Crítico | `src/services/actividadService.js` | 36-43 |
| 5 | REQ-ACT-07 | Visualización de actividades no restringida por cuadrilla — cualquier usuario autenticado ve todo | 🔴 Crítico | `src/routes/actividadRoutes.js` | 14 |
| 6 | REQ-SEC-05 | Usa `sequelize.sync({ alter: true })` — peligroso en producción, debe usar migraciones | 🔴 Crítico | `src/initialSetup.js` | 13 |
| 7 | REQ-SEC-07 | No hay rate limiting — rutas como login y donaciones son vulnerables a fuerza bruta/DoS | 🔴 Crítico | `src/app.js` | 1-42 |
| 8 | REQ-SEC-08 | Helmet no está instalado ni configurado — faltan cabeceras de seguridad HTTP | 🔴 Crítico | `package.json` | 1-25 |
| 9 | REQ-SEC-13 | No hay framework de testing — `package.json` no tiene script `test` | 🔴 Crítico | `package.json` | 7 |
| 10 | REQ-BEN-11 | Jefe de Cuadrilla no puede modificar familias (`PATCH`) — solo Central tiene permiso | 🟠 Alto | `src/routes/familiaRoutes.js` | 23 |
| 11 | REQ-BEN-02 | Jefe de Cuadrilla no puede modificar familias (aunque ahora sí puede CREAR, línea 14) | 🟠 Alto | `src/routes/familiaRoutes.js` | 23 |
| 12 | REQ-VOL-06 | No hay flujo de "organización invita → voluntario acepta"; solo postulación directa | 🟠 Alto | `src/services/postulacionService.js` | 65-87 |
| 13 | REQ-SEC-02 | `JWT_SECRET` default débil `ClaveSecretaTecho2026` — debe cambiarse en producción | 🟠 Alto | `src/config/configEnv.js` | 31 |
| 14 | REQ-SEC-03 | `NODE_ENV` no se fuerza a `production` — no hay validación en startup | 🟠 Alto | `src/config/configEnv.js` | 16 |
| 15 | REQ-BEN-04 | Ruta de prueba `GET /api/familias/test` pública sin auth — filtra info del módulo | 🟠 Alto | `src/routes/familiaRoutes.js` | 11 |
| 16 | REQ-ACT-06 | CRUD de actividades solo requiere `verifyToken` sin `authorizeRole` — cualquier rol autenticado crea/modifica/elimina | 🟡 Medio | `src/routes/actividadRoutes.js` | 13-17 |
| 17 | REQ-SEC-09 | `POST /api/auth/login` no tiene validación Joi — entrada sin sanitizar | 🟡 Medio | `src/controllers/authController.js` | 5-9 |
| 18 | REQ-ACT-09 | No hay interfaz de calendario (backend, no aplica directamente) | 🔵 Bajo | — | — |
| 19 | REQ-BEN-13 | No hay módulo de "postulación a beneficios" implementado | 🔵 Bajo | — | — |

---

## Cambios desde la auditoría anterior (merge con origin/main)

| Hallazgo anterior | Estado anterior | Estado actual | Explicación |
|---|---|---|---|
| REQ-ACT-02: Actividades sin `id_cuadrilla` | 🔴 Crítico | 🟢 Cumple | `ActividadModels.js` ahora tiene `id_cuadrilla` FK y relación con Cuadrilla |
| REQ-BEN-08: Sin validación dirección duplicada | 🔴 Crítico | 🟢 Cumple | `familiaService.js` ahora verifica calle+numero+comuna+region duplicados |
| REQ-DON-04/05/06/08/09: Donaciones incompletas | 🔴 Crítico (5) | 🟢 Cumple | Modelo con `comprobante_url`, `estado` (pendiente/validada/rechazada), upload con multer, endpoint `PATCH /:id` para cambiar estado |
| REQ-SEC-06: Sin CORS | 🔴 Crítico | 🟢 Cumple | `app.js` ahora usa `cors({ origin: 'http://localhost:3001' })` |
| REQ-DON-03: Donaciones sin validación Joi | 🟠 Alto | 🟢 Cumple | `donacionValidations.js` con schema y validación condicional según `es_anonimo` |
| REQ-SEC-11: Users vs UsuarioVoluntario sin sincronía | 🟠 Alto | 🟢 Cumple | `activarVoluntario` crea/actualiza fila en `users`; `updateVoluntario` sincroniza email/password |
| REQ-BEN-02: Jefe cuadrilla no podía crear familias | 🟠 Alto | 🟢 Cumple | `familiaRoutes.js:14` ahora incluye `jefe_cuadrilla` en POST |
| Nuevo: Módulo cuadrillas completo | — | 🟢 Cumple | CRUD completo con controller, service, routes, validations |

---

## Detalle por fase

### FASE 1 — Gestión de Voluntarios

**Cumple (6/6):** REQ-VOL-01, REQ-VOL-02, REQ-VOL-03, REQ-VOL-04, REQ-VOL-05
- REQ-VOL-01 a REQ-VOL-05: Completamente implementados (capacidades físicas, elegibilidad, postulación, asignación)

**Hallazgo:**
- **REQ-VOL-06** 🟠 Alto: El flujo no implementa "organización invita → voluntario acepta". Solo existe postulación directa del voluntario. El servicio `postularOAceptar` acepta ambos casos pero no hay endpoint de invitación.

### FASE 2 — Roles y Autenticación

**Cumple (3/6):** REQ-ROL-01, REQ-ROL-03, REQ-ROL-06

**Hallazgos:**
- **REQ-ROL-05** 🔴 Crítico (3 rutas): `PATCH /:rut/capacidades` (voluntarioRoutes.js:27), `GET /:rut/actividades-disponibles` (voluntarioRoutes.js:30) y `POST /actividades/:id/postular` (actividadRoutes.js:36) no tienen `verifyToken`. Documentado en `VOLUNTARIOS_IMPLEMENTATION.md:235`.
- **REQ-ROL-02/04** 🟠 Alto: El middleware `authorizeRole` funciona correctamente en rutas protegidas, pero la existencia de 3 rutas sin auth es una brecha de seguridad significativa.

### FASE 3 — Gestión de Actividades

**Cumple (5/9):** REQ-ACT-01, REQ-ACT-02, REQ-ACT-03, REQ-ACT-04, REQ-ACT-08

**Hallazgos:**
- **REQ-ACT-05** 🔴 Crítico: `ObtenerTodasLasActividades` (`actividadService.js:36-43`) usa `Actividad.findAll()` sin filtro por cuadrilla. El controlador no recibe ni usa `req.user`.
- **REQ-ACT-06** 🟡 Medio: Las rutas `POST /`, `PUT /:id`, `DELETE /:id` solo tienen `verifyToken`, no `authorizeRole`. Cualquier usuario autenticado (incluso `voluntario`) puede crear/modificar/eliminar actividades.
- **REQ-ACT-07** 🔴 Crítico: `GET /api/actividades` con `verifyToken` no tiene filtro por cuadrilla ni authorizeRole.
- **REQ-ACT-09** 🔵 Bajo: Interfaz de calendario es responsabilidad del frontend.

### FASE 4 — Gestión de Beneficiados

**Cumple (13/15):** REQ-BEN-01, REQ-BEN-02, REQ-BEN-03, REQ-BEN-05, REQ-BEN-06, REQ-BEN-07, REQ-BEN-08, REQ-BEN-09, REQ-BEN-10, REQ-BEN-12, REQ-BEN-14, REQ-BEN-15

**Hallazgos:**
- **REQ-BEN-04** 🟠 Alto: `GET /api/familias/test` (familiaRoutes.js:11) es pública sin autenticación.
- **REQ-BEN-11** 🟠 Alto: Jefe de Cuadrilla ahora puede CREAR familias (`POST` con `authorizeRole('central', 'jefe_cuadrilla')`) pero NO puede MODIFICAR (`PATCH` solo `authorizeRole('central')`). El requisito dice que Central o Jefe de Cuadrilla pueden modificar.
- **REQ-BEN-13** 🔵 Bajo: No hay funcionalidad de "postulación a beneficios" en el backend.

**Nuevo:** Validación de dirección duplicada implementada correctamente en `familiaService.js:26-38`.

### FASE 5 — Gestión de Donaciones

**Cumple (9/9):** REQ-DON-01, REQ-DON-02, REQ-DON-03, REQ-DON-04, REQ-DON-05, REQ-DON-06, REQ-DON-07, REQ-DON-08, REQ-DON-09

**Detalle de implementación:**
- **REQ-DON-01 a 03**: Donación con `es_anonimo` condicional, validación Joi con `crearDonacionSchema` (donacionValidations.js:29-73)
- **REQ-DON-04 a 05**: `uploadMiddleware.js` con multer, almacena en `uploads/`, sirve vía `express.static('uploads')`
- **REQ-DON-06 a 09**: Modelo con `estado` ENUM('pendiente','validada','rechazada'), endpoint `PATCH /:id` con `cambiarEstado` (donacionService.js:15-31)

Este módulo quedó completo tras el merge.

### FASE 6 — Seguridad y Producción

**Cumple (4/13):** REQ-SEC-01, REQ-SEC-06, REQ-SEC-10, REQ-SEC-12

**Hallazgos:**
- **REQ-SEC-02** 🟠 Alto: `JWT_SECRET` default `'ClaveSecretaTecho2026'` en `configEnv.js:31`.
- **REQ-SEC-03** 🟠 Alto: `NODE_ENV` default `'development'` en `configEnv.js:16`.
- **REQ-SEC-05** 🔴 Crítico: `initialSetup.js:13`: `sequelize.sync({ alter: true })`. En producción puede causar pérdida de datos. Usar migraciones.
- **REQ-SEC-07** 🔴 Crítico: No hay `express-rate-limit`. Rutas como `POST /api/auth/login` y `POST /api/donaciones` son vulnerables.
- **REQ-SEC-08** 🔴 Crítico: `helmet` no está instalado ni configurado.
- **REQ-SEC-09** 🟡 Medio: `POST /api/auth/login` no valida entrada con Joi (authController.js:5-9).
- **REQ-SEC-11** 🟢 Ahora cumple: `voluntarioService.js` sincroniza `UsuarioVoluntario` ↔ `User` en activación y actualización.
- **REQ-SEC-13** 🔴 Crítico: Sin framework de testing. `package.json` no tiene script `test`.

---

## Recomendaciones prioritarias

1. **🔴 Agregar autenticación a rutas de voluntarios** — `PATCH /:rut/capacidades`, `GET /:rut/actividades-disponibles` y `POST /actividades/:id/postular` deben requerir `verifyToken` (voluntarioRoutes.js:27,30 y actividadRoutes.js:36)

2. 🔴 **Filtrar actividades por cuadrilla del usuario** — `ObtenerTodasLasActividades` debe recibir el `id_cuadrilla` del JWT y filtrar. Además, restringir CRUD con `authorizeRole('central', 'jefe_cuadrilla')` (actividadRoutes.js:13-17, actividadService.js:36-43)

3. 🔴 **Seguridad de producción** — Instalar y configurar express-rate-limit y helmet. Reemplazar `sync({ alter: true })` por migraciones con `sequelize-cli`.

4. 🔴 **Agregar framework de testing** — Configurar Jest con script `test` y al menos pruebas unitarias para servicios críticos (elegibilidad, postulaciones, auth).

5. 🟠 **Permitir a Jefe de Cuadrilla modificar familias** — Agregar `jefe_cuadrilla` al `authorizeRole` del `PATCH /api/familias/:id` (familiaRoutes.js:23).

6. 🟠 **Validar login con Joi** — Agregar schema de validación a `POST /api/auth/login` para email y password (authController.js:5-9).

7. 🟠 **Configurar secrets para producción** — Asegurar que `JWT_SECRET` fuerte y `NODE_ENV=production` se configuren en el servidor.
