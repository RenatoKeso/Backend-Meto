const { DataTypes } = require('sequelize');
const sequelize = require('../config/configDb');

// ─────────────────────────────────────────────
// Entidad principal: Familia beneficiada
// ─────────────────────────────────────────────
const Familia = sequelize.define('Familia', {
  id_familia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  // Datos del jefe/representante del hogar
  nombre_representante: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido_representante: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  rut_representante: {
    type: DataTypes.STRING(12),
    allowNull: false,
    unique: true
  },
  contacto: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  // Dirección
  calle: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  numero: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  villa_poblacion: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  comuna: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  // Tipo de ayuda recibida
  tipo_ayuda: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  // Borrado lógico (igual que voluntarios)
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'familia',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// ─────────────────────────────────────────────
// Entidad secundaria: Integrantes del grupo familiar
// ─────────────────────────────────────────────
const MiembroFamilia = sequelize.define('MiembroFamilia', {
  id_miembro: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  edad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  parentesco: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'miembro_familia',
  timestamps: false
});

// ─────────────────────────────────────────────
// Asociaciones
// Una familia tiene muchos miembros
// ─────────────────────────────────────────────
Familia.hasMany(MiembroFamilia, { foreignKey: 'id_familia', as: 'integrantes', onDelete: 'CASCADE' });
MiembroFamilia.belongsTo(Familia, { foreignKey: 'id_familia' });

module.exports = {
  Familia,
  MiembroFamilia
};
