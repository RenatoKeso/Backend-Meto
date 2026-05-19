const { sequelize } = require('./entities');
const configEnv = require('./config/configEnv');
const userRepository = require('./repositories/userRepository');

const createTables = async () => {
  await sequelize.authenticate();
  await sequelize.sync();
};

const createDefaultUsers = async () => {
  await userRepository.createDefaultUsers([
    {
      name: configEnv.defaultAdmin.name,
      email: configEnv.defaultAdmin.email,
      password: configEnv.defaultAdmin.password,
      role: 'admin'
    }
  ]);
};

const initialSetup = async () => {
  await createTables();
  await createDefaultUsers();
};

if (require.main === module) {
  initialSetup()
    .then(async () => {
      console.log('Setup inicial completado correctamente.');
      await sequelize.close();
    })
    .catch(async (error) => {
      console.error('Error ejecutando el setup inicial:', error.message);
      await sequelize.close();
      process.exit(1);
    });
}

module.exports = initialSetup;
