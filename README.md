# Backend Meto

Backend inicial siguiendo el orden de avance pedido en metodologia del desarrollo:

1. Crear entidades desde el MER.
2. Crear configuracion de entorno y base de datos.
3. Crear el setup inicial para levantar tablas y datos base.
4. Configurar servicios, controladores y rutas.

## Estructura

- `src/entities`: entidades que se traspasan desde el MER al codigo.
- `src/config/configEnv.js`: extrae variables de entorno y las deja disponibles para el backend.
- `src/config/configDb.js`: crea la conexion a la base de datos usando las variables de entorno.
- `src/initialSetup.js`: crea las tablas y genera usuarios base cuando corresponde.
- `src/repositories`: acceso a datos de cada entidad.
- `src/app.js`: configuracion de Express.
- `src/server.js`: arranque del servidor.

## Primer uso

Instalar dependencias:

```bash
npm install
```

Crear la base de datos MySQL indicada en `.env`:

```sql
CREATE DATABASE backend_meto;
```

Ejecutar setup inicial:

```bash
npm run setup
```

Levantar el servidor:

```bash
npm run dev
```

Probar:

```bash
GET http://localhost:3000/health
```

