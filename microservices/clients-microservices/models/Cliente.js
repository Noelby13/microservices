const { DataTypes } = require('sequelize');
const { sequelize }= require('../config/db');

const Cliente = sequelize.define('Cliente', {
  id_cliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING(255),
  },
  telefono: {
    type: DataTypes.STRING(20),
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
  },
}, {
  tableName: 'clientes',
  timestamps: false,
});

module.exports = Cliente;