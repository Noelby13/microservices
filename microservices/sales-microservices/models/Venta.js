// src/models/Venta.js

const { DataTypes } = require('sequelize');
const  {sequelize }= require('../config/db');

// REMOVE the line that requires DetalleVenta if it's here.
// const DetalleVenta = require('./DetalleVenta');

const Venta = sequelize.define('Venta', {
  id_venta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fecha_venta: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  total_venta: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'ventas',
  timestamps: false,
});

// --- REMOVE THESE LINES FROM THIS FILE ---
// Venta.hasMany(DetalleVenta, { foreignKey: 'id_venta' });
// DetalleVenta.belongsTo(Venta, { foreignKey: 'id_venta' });
// ----------------------------------------

module.exports = Venta;