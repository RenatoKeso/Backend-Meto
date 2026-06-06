const { DataTypes } = require('sequelize');
const sequelize = require('../config/configDb');

const Rol = sequelize.define('Rol', {
  rol_id: {
    type: DataTypes.STRING(12),
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'rol',
  timestamps: false
});

const DatosMedicos = sequelize.define('DatosMedicos', {
  id_datos_medicos: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  discapacidad: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  alergias: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  enfermedades: {
    type: DataTypes.STRING(200),
    allowNull: true
  }
}, {
  tableName: 'datos_medicos',
  timestamps: false
});

const UsuarioVoluntario = sequelize.define('UsuarioVoluntario', {
  rut: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  passwd_hash: {
    type: DataTypes.STRING(256),
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    unique: true,
    allowNull: false
  },
  edad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  contacto: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  clasificacion: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  contacto_emergencia: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  id_datos_medicos: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'usuarios_voluntarios',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

const Asistencia = sequelize.define('Asistencia', {
  id_asistencia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  check_in_bus: {
    type: DataTypes.DATE,
    allowNull: false
  },
  hora_llegada: {
    type: DataTypes.DATE,
    allowNull: false
  },
  hora_salida: {
    type: DataTypes.DATE,
    allowNull: false
  },
  racion_alimento: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'asistencia',
  timestamps: false
});

const Bitacora = sequelize.define('Bitacora', {
  id_bitacora: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_hora: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  nombre: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(500),
    allowNull: false
  }
}, {
  tableName: 'bitacora',
  timestamps: false
});

const Proyecto = sequelize.define('Proyecto', {
  id_proyecto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  ubicacion: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'proyecto',
  timestamps: false
});

const Cuadrilla = sequelize.define('Cuadrilla', {
  id_cuadrilla: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'cuadrilla',
  timestamps: false
});

const Reporte = sequelize.define('Reporte', {
  id_reporte: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha_emision: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'reporte',
  timestamps: false
});

const Alerta = sequelize.define('Alerta', {
  id_alerta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tipo: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  resuelta: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'alerta',
  timestamps: false
});

// Relationships
UsuarioVoluntario.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rol' });
Rol.hasMany(UsuarioVoluntario, { foreignKey: 'rol_id' });

UsuarioVoluntario.belongsTo(DatosMedicos, { foreignKey: 'id_datos_medicos', as: 'datos_medicos' });
DatosMedicos.hasOne(UsuarioVoluntario, { foreignKey: 'id_datos_medicos' });

UsuarioVoluntario.hasMany(Asistencia, { foreignKey: 'rut', as: 'asistencias' }); 


Asistencia.belongsTo(UsuarioVoluntario, { foreignKey: 'rut' });
UsuarioVoluntario.hasMany(Asistencia, { foreignKey: 'rut' });

Bitacora.belongsTo(UsuarioVoluntario, { foreignKey: 'rut' });
UsuarioVoluntario.hasMany(Bitacora, { foreignKey: 'rut' });

Proyecto.belongsTo(UsuarioVoluntario, { foreignKey: 'rut', as: 'voluntario_asignado' });
UsuarioVoluntario.hasMany(Proyecto, { foreignKey: 'rut' });

Cuadrilla.belongsTo(Proyecto, { foreignKey: 'id_proyecto' });
Proyecto.hasMany(Cuadrilla, { foreignKey: 'id_proyecto' });

Cuadrilla.belongsTo(UsuarioVoluntario, { foreignKey: 'rut' });
UsuarioVoluntario.hasMany(Cuadrilla, { foreignKey: 'rut' });

Reporte.belongsTo(Proyecto, { foreignKey: 'id_proyecto' });
Proyecto.hasMany(Reporte, { foreignKey: 'id_proyecto' });

Reporte.belongsTo(UsuarioVoluntario, { foreignKey: 'rut', as: 'encargado_proyecto' });
UsuarioVoluntario.hasMany(Reporte, { foreignKey: 'rut' });

Alerta.belongsTo(Proyecto, { foreignKey: 'id_proyecto' });
Proyecto.hasMany(Alerta, { foreignKey: 'id_proyecto' });

module.exports = {
  UsuarioVoluntario,
  Rol,
  DatosMedicos,
  Asistencia,
  Bitacora,
  Proyecto,
  Cuadrilla,
  Reporte,
  Alerta
};
