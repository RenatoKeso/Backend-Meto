const sequelize = require("../config/configDb");
const User = require("./User");
const VoluntarioModels = require("./VoluntarioModels");
const FamiliaModels = require("./FamiliaModels");
const DonacionModels = require("./DonacionModels");
const ActividadModels = require("./ActividadModels");
const PostulacionModels = require("./PostulacionModels");

const entities = {
  User,
  ...VoluntarioModels,
  ...FamiliaModels,
  ...DonacionModels,
  ...ActividadModels,
  ...PostulacionModels,
};

module.exports = {
  sequelize,
  entities,
  User,
  ...VoluntarioModels,
  ...FamiliaModels,
  ...DonacionModels,
  ...ActividadModels,
  ...PostulacionModels,
};
