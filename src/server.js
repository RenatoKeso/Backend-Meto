const app = require('./app');
const configEnv = require('./config/configEnv');
const initialSetup = require('./initialSetup');

const logRoutes = (app) => {
  console.log('\n--- Rutas Registradas ---');
  
  const routes = [];
  
  const walk = (stack, prefix = '') => {
    stack.forEach((layer) => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods).filter(m => layer.route.methods[m]).join(', ').toUpperCase();
        routes.push(`${methods} ${prefix}${layer.route.path}`);
      } else if (layer.name === 'router' && layer.handle.stack) {
        // Attempt to find the prefix for this router
        const routePath = layer.regexp.source
          .replace('^\\', '')
          .replace('\\/', '/')
          .replace('(?:\\/)?', '')
          .replace(/\\s*$/, '')
          .replace(/\\/g, '');
        
        // This is a bit hacky, but usually the router's path is in the regexp
        // For Express 4.x, we can try to find the path from the regexp
        const match = layer.regexp.source.match(/^\/\^?([^\s\/)]+)/);
        const prefixPath = match ? match[1] : '';
        
        walk(layer.handle.stack, prefix + (prefixPath ? `/${prefixPath}` : ''));
      }
    });
  };

  walk(app._router.stack);
  
  if (routes.length > 0) {
    routes.forEach(r => console.log(r));
  } else {
    console.log('No se encontraron rutas.');
  }
  console.log('-------------------------\n');
};


  // Simplified log since we manually configured them
  console.log('Rutas configuradas:');
  console.log('  - /api/auth');
  console.log('  - /api/voluntarios');
  console.log('  - /health');
  console.log('  - /api/admin/dashboard');
  console.log('  - /api/user/perfil');
  console.log('-------------------------\n');



const startServer = async () => {
  await initialSetup();

  logRoutes(app);

  app.listen(configEnv.app.port, () => {
    console.log(`Servidor escuchando en http://localhost:${configEnv.app.port}`);
  });
};

startServer().catch((error) => {
  console.error('No se pudo iniciar el servidor:', error.message);
  process.exit(1);
});
