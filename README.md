# Backend-Meto

Sistema de gestión para la fundación **Techo**, desarrollado como proyecto de la asignatura de Metodología del Desarrollo. Permite administrar voluntarios, familias beneficiadas, cuadrillas, actividades y donaciones, con control de acceso según el rol del usuario.

---

## 📁 Estructura del proyecto

```
Backend-Meto/
├── src/                    # Backend (Node.js + Express + Sequelize)
│   ├── config/             # Configuración de entorno y base de datos
│   ├── controllers/        # Controladores de cada módulo
│   ├── entities/           # Modelos Sequelize
│   ├── middlewares/        # Autenticación, autorización y subida de archivos
│   ├── repositories/       # Acceso a datos
│   ├── routes/             # Definición de endpoints
│   ├── services/           # Lógica de negocio
│   ├── validations/        # Esquemas de validación (Joi)
│   ├── app.js
│   ├── server.js
│   └── initialSetup.js
├── frontend-meto/          # Frontend (React)
│   └── src/
│       ├── api/            # Clientes de conexión al backend
│       ├── components/     # Componentes reutilizables (Navbar, ProtectedRoute)
│       ├── context/        # Contexto de autenticación
│       └── pages/          # Vistas de cada módulo
├── uploads/                # Comprobantes de donaciones (no versionado)
├── package.json
└── .env
```

---

## 👥 Roles del sistema

El sistema define **3 roles**, según los definió el Product Owner de la fundación:

| Rol | Descripción |
|---|---|
| `central` | Fundación. Gestión estratégica, activación de voluntarios postulantes, control de inventario, validación de recursos. |
| `jefe_cuadrilla` | Control operativo de su obra, registro de hitos y tiempos, gestión de terreno. |
| `voluntario` | Consulta sus asignaciones, hace check-in, gestiona su información personal. |

Cada usuario se autentica con correo y contraseña, obtiene un token JWT, y el sistema restringe el acceso a las funcionalidades según su rol.

---

## 🚀 Backend — Instalación

### Requisitos
- Node.js 22+
- PostgreSQL 18+

### Pasos

1. Clona el repositorio y entra a la carpeta raíz:
   ```bash
   git clone https://github.com/RenatoKeso/Backend-Meto.git
   cd Backend-Meto
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Crea el archivo `.env` en la raíz con este contenido (ajusta según tu entorno):
   ```env
   PORT=3000
   NODE_ENV=development

   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=tu_contraseña

   DEFAULT_ADMIN_NAME=Administrador
   DEFAULT_ADMIN_EMAIL=admin@example.com
   DEFAULT_ADMIN_PASSWORD=admin123

   JWT_SECRET=una_clave_secreta
   ```

   > Si usas **WSL** y PostgreSQL corre en Windows, reemplaza `DB_HOST` por la IP que entrega `cat /etc/resolv.conf | grep nameserver | awk '{print $2}'`, y habilita esa IP en `pg_hba.conf`.

4. Crea la carpeta de comprobantes (si no existe):
   ```bash
   mkdir -p uploads
   ```

5. Levanta el servidor:
   ```bash
   npm run dev
   ```

   El servidor crea automáticamente las tablas y un usuario `central` por defecto (con las credenciales definidas en `.env`) en `http://localhost:3000`.

---

## 💻 Frontend — Instalación

1. En otra terminal, entra a la carpeta del frontend:
   ```bash
   cd frontend-meto
   npm install
   ```

2. Crea el archivo `.env` dentro de `frontend-meto`:
   ```env
   PORT=3001
   REACT_APP_API_URL=http://localhost:3000
   ```

3. Levanta la app:
   ```bash
   npm start
   ```

   Se abrirá en `http://localhost:3001`. El backend debe estar corriendo en paralelo.

---

## 🔌 Endpoints principales

### Autenticación (`/api/auth`)
| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| POST | `/login` | Público | Inicia sesión, devuelve token JWT |
| GET | `/me` | Autenticado | Datos del usuario logueado |
| POST | `/logout` | Autenticado | Cierra sesión |
| PATCH | `/usuarios/:id/rol` | `central` | Cambia el rol de un usuario |

### Voluntarios (`/api/voluntarios`)
| Método | Ruta | Rol |
|---|---|---|
| POST | `/` | Público (postulación) |
| GET | `/` | `central`, `jefe_cuadrilla` |
| GET | `/:rut` | `central`, `jefe_cuadrilla`, `voluntario` |
| PATCH | `/:rut` | `central`, `voluntario` |
| PATCH | `/:rut/activar` | `central` |
| DELETE | `/:rut` | `central` |

### Familias (`/api/familias`)
| Método | Ruta | Rol |
|---|---|---|
| POST | `/` | `central` |
| GET | `/`, `/:id` | `central`, `jefe_cuadrilla`, `voluntario` |
| PATCH `/`, DELETE `/:id` | `central` |

### Cuadrillas (`/api/cuadrillas`)
| Método | Ruta | Rol |
|---|---|---|
| POST | `/` | `central` |
| GET | `/` | `central` |

### Actividades (`/api/actividades`)
| Método | Ruta | Rol |
|---|---|---|
| POST | `/` | `central`, `jefe_cuadrilla` |
| GET `/`, `/:id` | Autenticado |
| PUT `/:id` | `central`, `jefe_cuadrilla` |
| DELETE `/:id` | `central` |
| POST `/:id/postular` | Voluntario (por RUT) |
| POST `/:id/asignar` | `central`, `jefe_cuadrilla` |

### Donaciones (`/api/donaciones`)
| Método | Ruta | Rol |
|---|---|---|
| POST | `/` | Público (anónima o registrada, comprobante obligatorio: JPG/PNG/PDF, máx. 5MB) |
| GET | `/` | `central` |
| PATCH | `/:id` | `central` (valida o rechaza) |

---


