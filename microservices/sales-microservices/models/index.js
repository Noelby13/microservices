// src/models/index.js

const sequelize = require('../config/db');
const Venta = require('./Venta');
const DetalleVenta = require('./DetalleVenta');

// --- Central place for all associations ---

// A Venta has many DetalleVenta records.
// We'll call the collection "Detalles".
Venta.hasMany(DetalleVenta, {
  foreignKey: 'id_venta',
  as: 'Detalles' // Using a clear, unique alias
});

// A DetalleVenta belongs to one Venta.
DetalleVenta.belongsTo(Venta, {
  foreignKey: 'id_venta'
  // No alias needed here unless you want to call Venta something else from DetalleVenta
});

// Export everything needed by the application
module.exports = {
  sequelize,
  Venta,
  DetalleVenta,
};