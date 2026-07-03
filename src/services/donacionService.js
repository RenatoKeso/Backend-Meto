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

module.exports = { crearDonacion, obtenerDonaciones };