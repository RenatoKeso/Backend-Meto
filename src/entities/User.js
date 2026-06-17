const { DataTypes } = require('sequelize');
const sequelize = require('../config/configDb');
const bcrypt = require('bcryptjs');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'coordinator', 'staff', 'volunteer', 'donor', 'auditor'),
      allowNull: false,
      defaultValue: 'volunteer'
    }
  },
  {
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  }
);

module.exports = User;

//QUE HACE ESTE CODIGO: Este código define un modelo de usuario
// Tiene los roles de admin, coordinator, staff, volunteer, donor y auditor
// Antes de crear un usuario, se encripta su contraseña utilizando bcrypt para mayor seguridad.