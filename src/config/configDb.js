const { Sequelize } = require('sequelize');
const configEnv = require('./configEnv');

const sequelize = new Sequelize(
  configEnv.database.name,
  configEnv.database.user,
  configEnv.database.password,
  {
    host: configEnv.database.host,
    port: configEnv.database.port,
    dialect: 'postgres',
    logging: false
  }
);

module.exports = sequelize;
//Este archivo es para la conexión a la base de datos utilizando Sequelize.
// Se importa la configuración de la base de datos desde configEnv, y se crea una instancia de Sequelize con esa configuración.
// Luego se exporta la instancia de Sequelize para que pueda ser utilizada en otras partes de la aplicación para interactuar con la base de datos.