const sequelize = require('../config/configDb');
const User = require('./User');
const VoluntarioModels = require('./VoluntarioModels');

const entities = {
  User,
  ...VoluntarioModels
};

module.exports = {
  sequelize,
  entities,
  User,
  ...VoluntarioModels
};
