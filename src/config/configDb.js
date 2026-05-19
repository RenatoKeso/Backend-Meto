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
    logging: configEnv.app.nodeEnv === 'development' ? console.log : false
  }
);

module.exports = sequelize;
