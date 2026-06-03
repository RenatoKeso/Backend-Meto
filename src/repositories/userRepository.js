const { User } = require('../entities');

const create = (userData) => User.create(userData);

const findByEmail = (email) => User.findOne({ where: { email } });

const findById = (id) => User.findByPk(id);

const createDefaultUsers = async (users) => {
  const createdUsers = await Promise.all(
    users.map(async (userData) => {
      const existingUser = await findByEmail(userData.email);
      if (existingUser) return existingUser;
      return create(userData);
    })
  );
  return createdUsers;
};

module.exports = { create, findByEmail, findById, createDefaultUsers };