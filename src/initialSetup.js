const { sequelize, Rol, UsuarioVoluntario } = require('./entities');
const configEnv = require('./config/configEnv');
const userRepository = require('./repositories/userRepository');
const bcrypt = require('bcryptjs');

const createTables = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
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

const seedVolunteers = async () => {
  const roles = [
    { rol_id: 'ROL_GEN', nombre: 'Coordinador General' },
    { rol_id: 'ROL_ZON', nombre: 'Coordinador Zonal' },
    { rol_id: 'ROL_JEF', nombre: 'Jefe de Cuadrilla' },
    { rol_id: 'ROL_CAP', nombre: 'Capataz' },
    { rol_id: 'ROL_OTR', nombre: 'Otros' },
  ];

  for (const role of roles) {
    await Rol.upsert(role);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('voluntario123', salt);

  const sampleVolunteers = [
    { rut: '12345678-9', passwd_hash: hashedPassword, nombre: 'Juan', apellido: 'Perez', email: 'juan@example.com', edad: 25, contacto: '56911111111', activo: true, clasificacion: 'obrero', rol_id: 'ROL_GEN' },
    { rut: '23456789-0', passwd_hash: hashedPassword, nombre: 'Maria', apellido: 'Lopez', email: 'maria@example.com', edad: 30, contacto: '56922222222', activo: true, clasificacion: 'obrero', rol_id: 'ROL_ZON' },
    { rut: '34567890-1', passwd_hash: hashedPassword, nombre: 'Pedro', apellido: 'Soto', email: 'pedro@example.com', edad: 22, contacto: '56933333333', activo: true, clasificacion: 'obrero', rol_id: 'ROL_JEF' },
    { rut: '45678901-2', passwd_hash: hashedPassword, nombre: 'Ana', apellido: 'Ruiz', email: 'ana@example.com', edad: 28, contacto: '56944444444', activo: true, clasificacion: 'obrero', rol_id: 'ROL_CAP' },
    { rut: '56789012-3', passwd_hash: hashedPassword, nombre: 'Luis', apellido: 'Jara', email: 'luis@example.com', edad: 35, contacto: '56955555555', activo: true, clasificacion: 'obrero', rol_id: 'ROL_OTR' },
  ];

  for (const vol of sampleVolunteers) {
    await UsuarioVoluntario.upsert(vol);
  }
};

const initialSetup = async () => {
  await createTables();
  await createDefaultUsers();
  await seedVolunteers();
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
//QUE HACE ESTE CODIGO: Este código realiza la configuración inicial de la base de datos
//Agregue las rutas que definen las operaciones relacionadas con los voluntarios, actividades y familias,
//y el controlador de autenticación para manejar el inicio de sesión y la obtención de información del usuario autenticado.
// Y tambien agregue la ruta /api/admin/dashboard (solo admin) y api/user/perfil (admin y user) y importe los middlwares
// de autenticación y autorización para proteger estas rutas.
