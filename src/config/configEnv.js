const dotenv = require('dotenv');

dotenv.config();

const requiredVariables = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER'];

requiredVariables.forEach((variableName) => {
  if (!process.env[variableName]) {
    throw new Error(`Falta configurar la variable de entorno ${variableName}`);
  }
});

const configEnv = {
  app: {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || ''
  },
  defaultAdmin: {
    name: process.env.DEFAULT_ADMIN_NAME || 'Administrador',
    email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com',
    password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'ClaveSecretaTecho2026'
  }
};

module.exports = configEnv;
