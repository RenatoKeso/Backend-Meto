const {DataTypes} = require('sequelize');
const sequelize = require('../config/configDb');

const Actividad = sequelize.define('Actividad', {
  id_actividad: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fecha: {
    type: DataTypes.DATEONLY,   
    allowNull: false,
  },
  hora: {
    type: DataTypes.TIME,       
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'en_progreso', 'completada', 'cancelada'),
    allowNull: false,
    defaultValue: 'pendiente',
  },

  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'actividades',
  timestamps: true,             
});

module.exports = { Actividad };