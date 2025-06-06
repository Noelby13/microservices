const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');



// Rutas para obtener clientes
// GET /api/clientes -> Obtiene todos los clientes
router.get('/', clienteController.getClientes);

// GET /api/clientes/:id -> Obtiene un cliente por su ID
router.get('/:id', clienteController.getClienteById);

// Ruta para crear un nuevo cliente
// POST /api/clientes
router.post('/', clienteController.createCliente);

// Ruta para actualizar un cliente
// PUT /api/clientes/:id
router.put('/:id', clienteController.updateCliente);

// Ruta para eliminar un cliente
// DELETE /api/clientes/:id
router.delete('/:id', clienteController.deleteCliente);


module.exports = router;