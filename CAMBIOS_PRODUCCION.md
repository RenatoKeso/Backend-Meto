# Guía de Seguridad para Entornos de Producción

Este documento detalla las configuraciones y cambios necesarios para desplegar el backend de gestión de voluntarios en un entorno de producción, asegurando la confidencialidad, integridad y disponibilidad de la información.

## 🔐 1. Gestión de Secretos y Variables de Entorno

**NUNCA** subas el archivo `.env` al repositorio de Git.

- **JWT_SECRET**: Cambia el secreto por defecto por una cadena larga, aleatoria y compleja. Puedes generar una usando:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **DB_PASSWORD**: Utiliza contraseñas fuertes y únicas para la base de datos.
- **NODE_ENV**: Configura la variable `NODE_ENV=production` para optimizar el rendimiento y desactivar logs detallados de desarrollo.

## 🗄️ 2. Seguridad de la Base de Datos

- **Principio de Menor Privilegio**: No utilices el usuario `postgres` (superuser) en producción. Crea un usuario específico para la aplicación con permisos limitados solo a las tablas necesarias.
- **Sincronización de Tablas**: **IMPORTANTE**. Cambia `sequelize.sync({ alter: true })` por el uso de **Migraciones**. El modo `alter` puede causar pérdida de datos o bloqueos en tablas grandes en producción.
- **Conexiones Seguras**: Configura la conexión a la base de datos mediante SSL/TLS para evitar la interceptación de datos en tránsito.

## 🌐 3. Seguridad de la API y Red

- **HTTPS/TLS**: Despliega la aplicación detrás de un proxy inverso (como Nginx o Apache) con certificados SSL (Let's Encrypt).
- **CORS (Cross-Origin Resource Sharing)**: Configura el middleware de CORS para permitir peticiones únicamente desde los dominios oficiales del frontend.
- **Rate Limiting**: Implementa un limitador de peticiones (ej. `express-rate-limit`) para prevenir ataques de denegación de servicio (DoS) y fuerza bruta en el login.
- **Helmet**: Instala y utiliza el middleware `helmet` para añadir cabeceras de seguridad HTTP esenciales.

## 🛡️ 4. Autenticación y Validación

- **Validación Estricta**: Mantén y expande los esquemas de `Joi` para evitar la inyección de datos maliciosos.
- **Expiración de Tokens**: Configura el tiempo de vida del JWT (`expiresIn`) a un valor corto (ej. 1h) y considera la implementación de *Refresh Tokens*.
- **Bcrypt**: Mantén el factor de costo de `bcryptjs` en 10 o superior para dificultar ataques de diccionario.

## 📋 Checklist de Despliegue

- [ ] `.env` configurado en el servidor (no en Git).
- [ ] `JWT_SECRET` actualizado a un valor aleatorio.
- [ ] `NODE_ENV` establecido en `production`.
- [ ] Base de datos configurada con usuario de permisos limitados.
- [ ] Certificado SSL activo (HTTPS).
- [ ] CORS restringido a dominios permitidos.
- [ ] Implementado Rate Limiting en rutas críticas.
