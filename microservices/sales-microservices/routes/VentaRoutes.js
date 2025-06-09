// routes/venta.routes.js
const express = require('express');
const VentaController = require('../controllers/venta.controller');

const router = express.Router();

// Obtiene todas las ventas enriquecidas
router.get('/', VentaController.getVentas);

// Crea una nueva venta
router.post('/', VentaController.createVenta);

// Obtiene una venta específica por su ID, enriquecida
router.get('/:id', VentaController.getVentaById);

// Obtiene todas las ventas de un cliente específico, enriquecidas
router.get('/cliente/:id_cliente', VentaController.getVentasByCliente);

module.exports = router;
