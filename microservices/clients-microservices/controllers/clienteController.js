const Cliente = require('../models/Cliente');

/**
 * @description Obtiene todos los clientes de la base de datos.
 * @param {*} req El objeto de solicitud de Express.
 * @param {*} res El objeto de respuesta de Express.
 */
exports.getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los clientes', error: error.message });
  }
};

/**
 * @description Obtiene un único cliente por su ID.
 * @param {*} req El objeto de solicitud de Express (espera un 'id' en los parámetros).
 * @param {*} res El objeto de respuesta de Express.
 */
exports.getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cliente', error: error.message });
  }
};

/**
 * @description Crea un nuevo cliente en la base de datos.
 * @param {*} req El objeto de solicitud de Express (espera los datos del cliente en el body).
 * @param {*} res El objeto de respuesta de Express.
 */
exports.createCliente = async (req, res) => {
  try {
    // El body contendrá: nombre, apellido, direccion, telefono, email
    const nuevoCliente = await Cliente.create(req.body);
    res.status(201).json(nuevoCliente);
  } catch (error) {
    // Manejo de errores, como un email duplicado
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El email ya está en uso.' });
    }
    res.status(500).json({ message: 'Error al crear el cliente', error: error.message });
  }
};

/**
 * @description Actualiza un cliente existente por su ID.
 * @param {*} req El objeto de solicitud de Express (espera 'id' en params y datos en el body).
 * @param {*} res El objeto de respuesta de Express.
 */
exports.updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Cliente.update(req.body, {
      where: { id_cliente: id }
    });

    if (updated) {
      const clienteActualizado = await Cliente.findByPk(id);
      res.status(200).json({ message: 'Cliente actualizado correctamente', cliente: clienteActualizado });
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' });
    }
  } catch (error) {
     if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El email ya está en uso por otro cliente.' });
    }
    res.status(500).json({ message: 'Error al actualizar el cliente', error: error.message });
  }
};

/**
 * @description Elimina un cliente por su ID.
 * @param {*} req El objeto de solicitud de Express (espera un 'id' en los parámetros).
 * @param {*} res El objeto de respuesta de Express.
 */
exports.deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Cliente.destroy({
      where: { id_cliente: id }
    });

    if (deleted) {
      res.status(200).json({ message: 'Cliente eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cliente', error: error.message });
  }
};