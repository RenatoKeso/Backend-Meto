const app = require('./app');
const configEnv = require('./config/configEnv');
const initialSetup = require('./initialSetup');

const startServer = async () => {
  await initialSetup();

  app.listen(configEnv.app.port, () => {
    console.log(`Servidor escuchando en http://localhost:${configEnv.app.port}`);
  });
};

startServer().catch((error) => {
  console.error('No se pudo iniciar el servidor:', error.message);
  process.exit(1);
});
