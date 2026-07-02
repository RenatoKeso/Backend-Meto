const { DataTypes } = require('sequelize');
const sequelize = require('../config/configDb');
const { Actividad } = require('./ActividadModels');
const { UsuarioVoluntario } = require('./VoluntarioModels');

/**
 * Representa la relación entre un voluntario y una actividad:
 * - 'postulado'  -> el voluntario se postuló o aceptó la invitación (esperando confirmación de la organización)
 * - 'asignado'   -> la organización confirmó definitivamente al voluntario en la actividad
 * - 'rechazado'  -> la organización rechazó la postulación del voluntario
 */
const PostulacionActividad = sequelize.define('PostulacionActividad', {
  id_postulacion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  estado: {
    type: DataTypes.ENUM('postulado', 'asignado', 'rechazado'),
    allowNull: false,
    defaultValue: 'postulado'
  },
  fecha_postulacion: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  fecha_asignacion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  asignado_por: {
    type: DataTypes.STRING(150),
    allowNull: true
  }
}, {
  tableName: 'postulacion_actividad',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['id_actividad', 'rut_voluntario'] }
  ]
});

// Relaciones
PostulacionActividad.belongsTo(Actividad, { foreignKey: 'id_actividad' });
Actividad.hasMany(PostulacionActividad, { foreignKey: 'id_actividad', as: 'postulaciones' });

PostulacionActividad.belongsTo(UsuarioVoluntario, { foreignKey: 'rut_voluntario', as: 'voluntario' });
UsuarioVoluntario.hasMany(PostulacionActividad, { foreignKey: 'rut_voluntario', as: 'postulaciones' });

module.exports = { PostulacionActividad };
