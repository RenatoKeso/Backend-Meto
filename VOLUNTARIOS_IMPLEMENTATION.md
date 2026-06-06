# DOCUMENTACION PARA LOS DESARROLLADORES

# Implementación de Gestión de Voluntarios

Se ha integrado el módulo de gestión de voluntarios desde el directorio `src/` al repositorio `Backend-Meto/`. Debido a que `Backend-Meto` utiliza **Sequelize** y el código original utilizaba **TypeORM**, se realizó una traducción completa de la capa de datos y lógica de negocio.

## 🛠 Cambios Realizados

### 1. Dependencias
- Instalación de `joi` para la validación de esquemas de entrada de datos.

### 2. Nuevos Archivos y Componentes
Los archivos fueron renombrados o creados con prefijos específicos para evitar conflictos con la estructura existente:

| Archivo | Propósito |
| :--- | :--- |
| `src/entities/VoluntarioModels.js` | Definición de modelos de Sequelize para Voluntarios, Roles, Datos Médicos, Asistencia, Bitácora, Proyectos, Cuadrillas, Reportes y Alertas. |
| `src/services/voluntarioService.js` | Lógica de negocio para el CRUD de voluntarios (creación, lectura, actualización y borrado lógico). |
| `src/controllers/voluntarioController.js` | Manejo de peticiones HTTP y orquestación entre validaciones y servicios. |
| `src/routes/voluntarioRoutes.js` | Definición de los endpoints para la gestión de voluntarios. |
| `src/validations/voluntarioValidations.js` | Esquemas de validación de datos utilizando Joi. |
| `src/handlers/responseHandler.js` | Utilidad para estandarizar las respuestas de éxito y error de la API. |

### 3. Integración en la App
- Se actualizaron las importaciones en `src/app.js`.
- Se registró el prefijo de ruta `/api/voluntarios` para acceder a todas las funcionalidades del CRUD.

## 🚀 Endpoints Implementados

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/voluntarios` | Crea un nuevo voluntario. |
| `GET` | `/api/voluntarios` | Obtiene la lista de voluntarios (soporta query `incluirInactivos=true`). |
| `GET` | `/api/voluntarios/:rut` | Obtiene el detalle de un voluntario por su RUT. |
| `PATCH` | `/api/voluntarios/:rut` | Actualiza la información de un voluntario. |
| `DELETE` | `/api/voluntarios/:rut` | Realiza un borrado lógico (cambia `activo` a `false`). |

## 📝 Notas Técnicas
- **Traducción de ORM**: Se mapearon las entidades de TypeORM a `sequelize.define`.
- **Relaciones**: Se establecieron las asociaciones `belongsTo` y `hasMany` para mantener la integridad referencial de la base de datos.
- **Seguridad**: Se mantuvo el hashing de contraseñas mediante `bcryptjs` antes de la persistencia.


## formato json para crear voluntario en la api

```json
{
  "rut": "21699026-9",
  "password": "password123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@example.com",
  "edad": 25,
  "contacto": "56912345678",
  "activo": true,
  "clasificacion": "obrero",
  "contacto_emergencia": "56987654321",
  "rol_id": "ROL_GEN"
}
```
## formato de ruta para eliminar un voluntario (borrado lógico)

``` /api/voluntarios/12345678-9 ```