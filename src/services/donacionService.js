const { Donacion } = require('../entities/DonacionModels');

const crearDonacion = async (datos) => {
  const donacion = await Donacion.create(datos);
  return donacion;
};

const obtenerDonaciones = async () => {
  const donaciones = await Donacion.findAll({
    order: [['createdAt', 'DESC']]
  });
  return donaciones;
};

const cambiarEstado = async (id, estado) => {
  const donacion = await Donacion.findByPk(id);
  if (!donacion) {
    const error = new Error('Donacion no encontrada');
    error.statusCode = 404;
    throw error;
  }
  const estadosValidos = ['pendiente', 'validada', 'rechazada'];
  if (!estadosValidos.includes(estado)) {
    const error = new Error('Estado no valido');
    error.statusCode = 400;
    throw error;
  }
  donacion.estado = estado;
  await donacion.save();
  return donacion;
};

module.exports = { crearDonacion, obtenerDonaciones, cambiarEstado };