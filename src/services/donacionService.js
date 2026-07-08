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

const obtenerDonacionPorId = async (id) => {
  const donacion = await Donacion.findByPk(id);
  if (!donacion) {
    const error = new Error('Donacion no encontrada');
    error.statusCode = 404;
    throw error;
  }
  return donacion;
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

const obtenerIngresosEfectivos = async () => {
  const donacionesValidas = await Donacion.findAll({ where: { estado: 'validada' } });
  const totalIngresos = donacionesValidas.reduce((acumulado, donacion) => acumulado + donacion.monto, 0);
  return { totalIngresos, cantidadDonaciones: donacionesValidas.length };
};

module.exports = { crearDonacion, obtenerDonaciones, cambiarEstado, obtenerIngresosEfectivos, obtenerDonacionPorId };