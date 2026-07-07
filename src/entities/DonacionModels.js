const { DataTypes } = require('sequelize');
const sequelize = require('../config/configDb');

const Donacion = sequelize.define('Donacion', {
  id_donacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rut: {
    type: DataTypes.STRING(12),
    allowNull: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  correo: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  monto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  es_anonimo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  comprobante_url: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'validada', 'rechazada'),
    allowNull: false,
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'donaciones',
  timestamps: true
});

module.exports = { Donacion };