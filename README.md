# Techo Chile — Sistema de Gestión

Sistema web para la gestión interna de una fundación tipo Techo Chile: voluntarios, cuadrillas, familias beneficiadas, actividades y donaciones. Proyecto de la asignatura *Metodología de Desarrollo*.

## Stack tecnológico

**Backend**
- Node.js + Express
- Sequelize + PostgreSQL
- JWT (`jsonwebtoken`) para autenticación
- `bcryptjs` para hash de contraseñas
- `multer` para subida de comprobantes
- `joi` para validación de datos

**Frontend**
- React 19 + React Router
- `react-big-calendar` + `date-fns` (calendario de actividades)

## Estructura del proyecto

```
Backend-Meto/
├── src/                        # Backend
│   ├── controllers/             # Manejo de requests/responses
│   ├── services/                # Lógica de negocio
│   ├── entities/                # Modelos Sequelize
│   ├── routes/                  # Definición de endpoints
│   ├── middlewares/              # verifyToken, authorizeRole
│   ├── validations/              # Esquemas Joi
│   ├── repositories/              # Acceso a la tabla `users`
│   ├── config/                  # Conexión a BD y variables de entorno
│   ├── initialSetup.js           # Crea tablas y datos de prueba al arrancar
│   └── server.js                # Punto de entrada
└── frontend-meto/               # Frontend (Create React App)
    └── src/
        ├── api/                  # Clientes HTTP por módulo
        ├── pages/                 # Vistas, organizadas por módulo
        ├── components/            # Navbar, ProtectedRoute
        └── context/               # AuthContext (sesión, token)
```

## Instalación

### Requisitos
- Node.js 18+
- Una base de datos PostgreSQL (por ejemplo, un proyecto de [Supabase](https://supabase.com))

### Backend

```bash
npm install
cp .env.example .env   # completar con los datos de tu base de datos
npm run dev
```

Variables de entorno (`.env`):

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del backend (por defecto 3000/3001 según config) |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Conexión a PostgreSQL |
| `DEFAULT_ADMIN_NAME`, `DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_PASSWORD` | Cuenta `central` que se crea automáticamente al arrancar |
| `JWT_SECRET` | Clave para firmar los tokens de sesión |
| `CORS_ORIGIN` | Origen permitido para las peticiones del frontend |

Al arrancar (`npm run dev` o `npm start`), el servidor:
1. Se conecta a la base de datos y sincroniza las tablas (`sequelize.sync()`).
2. Crea la cuenta `central` por defecto (con los datos de `DEFAULT_ADMIN_*`).
3. Siembra roles de ejemplo (`ROL_CEN`, `ROL_JEF`, `ROL_VOL`, `ROL_OTR`) y 5 voluntarios de prueba con la contraseña `voluntario123`.

### Frontend

```bash
cd frontend-meto
npm install
npm start
```

Corre en `http://localhost:3001` (o el siguiente puerto libre) y apunta por defecto a un backend en `http://localhost:3000`. Para apuntar a otro backend, definir `REACT_APP_API_URL` en un `.env` dentro de `frontend-meto/`.

## Roles y permisos

El sistema tiene 3 roles de sesión (`users.role`), independientes del "cargo" (`rol_id`) que se le asigna a un voluntario al activarlo:

| Rol | Puede hacer |
|---|---|
| `central` | Acceso completo: gestiona voluntarios, familias, cuadrillas, actividades y donaciones. Único rol que valida postulantes, cambia roles de sistema y revisa donaciones. |
| `jefe_cuadrilla` | Gestiona su propia cuadrilla: ve/registra/edita familias, ve y gestiona actividades de su cuadrilla, ve a su equipo de voluntarios. |
| `voluntario` | Consulta y actualiza sus propios datos y capacidades físicas, ve las actividades de su cuadrilla y se postula a las que cumple los requisitos. |

Cada actividad y cada voluntario pertenece a una **cuadrilla** (`id_cuadrilla`); salvo `central`, cada usuario solo ve los datos de su propia cuadrilla.

## Rutas públicas (sin necesidad de cuenta)

- **`/`** — landing page del proyecto, con acceso directo a postularse como voluntario o a donar, sin necesidad de iniciar sesión.
- **`/postular`** — formulario de postulación como voluntario.
- **`/donar`** — formulario de donación (anónima o con datos del donante).

## Módulos

- **Voluntarios**: postulación pública (`/postular`), activación por Central asignándole un cargo (`rol_id`), edición de datos propios y capacidades físicas.
- **Cuadrillas**: agrupan voluntarios bajo un jefe de cuadrilla; Central asigna/quita miembros.
- **Familias**: registro de familias beneficiadas, con borrado lógico (nunca se eliminan físicamente).
- **Actividades**: calendario de actividades por cuadrilla, con requisitos (edad, movilidad, resistencia, capacidad de carga). Los voluntarios elegibles pueden postularse; Central/Jefe de cuadrilla asigna la participación definitiva.
- **Donaciones**: formulario público (`/donar`), anónimo o con datos del donante, con comprobante obligatorio (imagen o PDF). Central revisa y valida o rechaza cada donación; solo las validadas cuentan como ingreso efectivo.

## Credenciales de prueba

Creadas automáticamente por `initialSetup.js` al arrancar el backend:

| Rol | Email | Contraseña |
|---|---|---|
| Central | el definido en `DEFAULT_ADMIN_EMAIL` (`.env`) | el definido en `DEFAULT_ADMIN_PASSWORD` |
| Voluntario (ejemplo) | `juan@example.com` | `voluntario123` |

## Scripts disponibles

**Backend** (raíz del proyecto)
- `npm run dev` — levanta el servidor con recarga automática (nodemon)
- `npm start` — levanta el servidor en modo normal
- `npm run setup` — corre el seed inicial manualmente

**Frontend** (`frontend-meto/`)
- `npm start` — servidor de desarrollo
- `npm run build` — build de producción
