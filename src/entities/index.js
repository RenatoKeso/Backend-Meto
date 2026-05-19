const sequelize = require('../config/configDb');
const User = require('./User');

const entities = {
  User
};

module.exports = {
  sequelize,
  entities,
  User
};
