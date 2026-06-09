const sequelize = require('../config/configDb');
const User = require('./User');
const VoluntarioModels = require('./VoluntarioModels');
const FamiliaModels = require('./FamiliaModels');

const entities = {
  User,
  ...VoluntarioModels,
  ...FamiliaModels
};

module.exports = {
  sequelize,
  entities,
  User,
  ...VoluntarioModels,
  ...FamiliaModels
};
