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

//QUE HACE ESTE CODIGO: Este código define un repositorio de usuarios para una aplicación 
// Contiene funciones para crear un nuevo usuario, encontrar un usuario por correo electrónico, 
// Encontrar un usuario por ID y crear usuarios predeterminados si no existen.
// La funcion findById se usa en authService para obtener la información del usuario autenticado utilizando su ID.
//.maps que hace

//Middlewares que son funciones que se ejecutan durante el ciclo de vida de una solicitud HTTP en una aplicación web.
//Controllers que son responsables de manejar las solicitudes HTTP, procesar la lógica de negocio y enviar respuestas al cliente.
//const { integrantes, ...datosFamilia } =payload; ¿Que hace esa linea? 
// Esta línea utiliza la sintaxis de destructuración de objetos en JavaScript para extraer la propiedad 
// "integrantes" del objeto "payload" y asignarla a una variable llamada "integrantes". El resto de las propiedades del objeto "payload" se agrupan en un nuevo objeto llamado "datosFamilia". Esto permite separar los datos relacionados con los integrantes de la familia del resto de la información contenida en el objeto "payload".