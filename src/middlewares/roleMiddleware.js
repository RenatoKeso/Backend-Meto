const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No autenticado.' });
    }

    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para esta acción.' });
    }

    next();
  };
};

module.exports = { authorizeRole };

//QUE HACE ESTE CODIGO: Este código define un middleware de autorización basado en roles para una aplicación Node.js.
// El middleware verifica si el usuario autenticado tiene uno de los roles permitidos para acceder a una ruta específica.
// Si el rol no esta autorizado respondemos con un 403 y el mensaje "Acceso denegado. No tienes permiso para esta acción."
//Se usa despues para authMiddleware y este recibe como parametros los roles permitidos, por ejemplo: authorizeRole('admin', 'Coordinador') 
// y solo los usuarios con esos roles podran acceder a esa ruta.