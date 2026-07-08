const { DataTypes } = require("sequelize");
const sequelize = require("../config/configDb");
const { Cuadrilla } = require("./VoluntarioModels");

const Actividad = sequelize.define(
  "Actividad",
  {
    id_cuadrilla:{
      type: DataTypes.INTEGER,
      allowNull: true,
    },
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
      type: DataTypes.ENUM(
        "pendiente",
        "en_progreso",
        "completada",
        "cancelada",
      ),
      allowNull: false,
      defaultValue: "pendiente",
    },

    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Requisitos para que un voluntario pueda postular/ser invitado (opcionales)
    edad_minima: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    edad_maxima: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    movilidad_requerida: {
      type: DataTypes.ENUM("baja", "media", "alta"),
      allowNull: true,
    },
    resistencia_requerida: {
      type: DataTypes.ENUM("baja", "media", "alta"),
      allowNull: true,
    },
    capacidad_carga_requerida: {
      type: DataTypes.ENUM("baja", "media", "alta"),
      allowNull: true,
    },
  },
  {
    tableName: "actividades",
    timestamps: true,
  },
);
Actividad.belongsTo(Cuadrilla, { foreignKey: "id_cuadrilla" });
Cuadrilla.hasMany(Actividad, { foreignKey: "id_cuadrilla" });
module.exports = { Actividad };












