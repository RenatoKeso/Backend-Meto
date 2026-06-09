const sequelize = require('../config/configDb');
const User = require('./User');
const VoluntarioModels = require('./VoluntarioModels');
const FamiliaModels = require('./FamiliaModels');
const DonacionModels = require('./DonacionModels');

const entities = {
  User,
  ...VoluntarioModels,
  ...FamiliaModels,
  ...DonacionModels
};

module.exports = {
  sequelize,
  entities,
  User,
  ...VoluntarioModels,
  ...FamiliaModels,
  ...DonacionModels
};
