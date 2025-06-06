const { Venta, DetalleVenta } = require('../models');
const { sequelize } = require('../config/db'); // ✅ Correcto

const axios = require('axios');

// URLs base de los otros microservicios (ajústalas si es necesario)
const CLIENTES_API_URL = 'http://localhost:3001/clientes';
const PRODUCTOS_API_URL = 'http://localhost:3002/products';

// --- FUNCIÓN DE CREACIÓN (sin cambios) ---
exports.createVenta = async (req, res) => {
    const { id_cliente, productos } = req.body;

    try {
        // Validar cliente
        await axios.get(`${CLIENTES_API_URL}/${id_cliente}`);

        let total_venta = 0;

        // Validar stock y calcular totales
        const detalles_promesas = productos.map(async (p) => {
            const { data: producto } = await axios.get(`${PRODUCTOS_API_URL}/${p.id_producto}`);

            if (producto.stock < p.cantidad) {
                throw new Error(`Stock insuficiente para el producto ${producto.nombre}`);
            }

            const subtotal = producto.precio * p.cantidad;
            total_venta += subtotal;

            return {
                id_producto: p.id_producto,
                cantidad: p.cantidad,
                precio_unitario: producto.precio,
                subtotal: subtotal
            };
        });

        const detalles = await Promise.all(detalles_promesas);

        // Crear venta
        const nuevaVenta = await Venta.create({ id_cliente, total_venta });

        // Crear detalles y actualizar stock
        for (const detalle of detalles) {
            detalle.id_venta = nuevaVenta.id_venta;

            await DetalleVenta.create(detalle);

            await axios.put(`${PRODUCTOS_API_URL}/stock/${detalle.id_producto}`, {
                cantidad: detalle.cantidad
            });
        }

        res.status(201).json(nuevaVenta);
    } catch (error) {
        console.error(error);
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data.message : error.message;
        res.status(status).json({ message, error: error.message });
    }
};


// --- FUNCIONES DE CONSULTA TOTALMENTE ENRIQUECIDAS Y ACTUALIZADAS ---

/**
 * @description Obtiene un listado de TODAS las ventas, enriqueciendo cada una
 * con los datos del cliente y los productos correspondientes.
 */
exports.getVentas = async (req, res) => {
    try {
        // 1. Obtener todas las ventas con sus detalles usando el alias 'Detalles'
        const ventas = await Venta.findAll({
            include: [{ model: DetalleVenta, as: 'Detalles' }], // <-- CAMBIO AQUÍ
            order: [['fecha_venta', 'DESC']]
        });

        if (!ventas || ventas.length === 0) {
            return res.status(200).json([]);
        }

        // 2. Recolectar IDs únicos (usando el alias 'Detalles')
        const clienteIds = [...new Set(ventas.map(v => v.id_cliente))];
        const productoIds = [...new Set(ventas.flatMap(v => v.Detalles.map(d => d.id_producto)))]; // <-- CAMBIO AQUÍ

        // 3. Obtener los datos externos
        const [clientesResponse, productosResponse] = await Promise.all([
            Promise.all(clienteIds.map(id => axios.get(`${CLIENTES_API_URL}/${id}`))),
            Promise.all(productoIds.map(id => axios.get(`${PRODUCTOS_API_URL}/${id}`)))
        ]);

        // 4. Crear mapas para búsqueda rápida
        const clientesMap = new Map(clientesResponse.map(r => [r.data.id_cliente, r.data]));
        const productosMap = new Map(productosResponse.map(r => [r.data.id_producto, r.data]));

        // 5. Componer la respuesta final (usando el alias 'Detalles')
        const respuestaFinal = ventas.map(venta => {
            const cliente = clientesMap.get(venta.id_cliente);
            const detalles = venta.Detalles.map(detalle => { // <-- CAMBIO AQUÍ
                const producto = productosMap.get(detalle.id_producto);
                return {
                    cantidad: detalle.cantidad,
                    precio_unitario: detalle.precio_unitario,
                    subtotal: detalle.subtotal,
                    producto: {
                        nombre: producto.nombre,
                        descripcion: producto.descripcion
                    }
                };
            });

            return {
                id_venta: venta.id_venta,
                fecha_venta: venta.fecha_venta,
                total_venta: venta.total_venta,
                cliente: {
                    nombre: cliente.nombre,
                    apellido: cliente.apellido,
                    email: cliente.email
                },
                detalles
            };
        });

        res.status(200).json(respuestaFinal);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener y enriquecer las ventas', error: error.message });
    }
};


/**
 * @description Obtiene una venta específica por su ID, con datos enriquecidos.
 */
exports.getVentaById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Obtener datos base de la venta usando el alias 'Detalles'
        const venta = await Venta.findByPk(id, { 
            include: [{ model: DetalleVenta, as: 'Detalles' }] // <-- CAMBIO AQUÍ
        });

        if (!venta) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        // 2. Obtener datos externos
        const [clienteResponse, detallesEnriquecidosPromises] = await Promise.all([
            axios.get(`${CLIENTES_API_URL}/${venta.id_cliente}`),
            Promise.all(venta.Detalles.map(detalle => // <-- CAMBIO AQUÍ
                axios.get(`${PRODUCTOS_API_URL}/${detalle.id_producto}`)
            ))
        ]);

        // 3. Mapear los detalles (usando el alias 'Detalles')
        const detallesCompletos = venta.Detalles.map((detalle, index) => { // <-- CAMBIO AQUÍ
            const productoData = detallesEnriquecidosPromises[index].data;
            return {
                cantidad: detalle.cantidad,
                precio_unitario: detalle.precio_unitario,
                subtotal: detalle.subtotal,
                producto: {
                    nombre: productoData.nombre,
                    descripcion: productoData.descripcion
                }
            };
        });

        // 4. Componer la respuesta final
        const respuestaFinal = {
            id_venta: venta.id_venta,
            fecha_venta: venta.fecha_venta,
            total_venta: venta.total_venta,
            cliente: {
                nombre: clienteResponse.data.nombre,
                apellido: clienteResponse.data.apellido,
                email: clienteResponse.data.email
            },
            detalles: detallesCompletos
        };

        res.status(200).json(respuestaFinal);

    } catch (error) {
        console.error(error);
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data.message : 'Error al componer la respuesta de la venta';
        res.status(status).json({ message, error: error.message });
    }
};


/**
 * @description Obtiene todas las ventas de un cliente específico, totalmente enriquecidas.
 */
exports.getVentasByCliente = async (req, res) => {
    try {
        const { id_cliente } = req.params;

        // 1. Obtener todas las ventas del cliente usando el alias 'Detalles'
        const ventas = await Venta.findAll({
            where: { id_cliente },
            include: [{ model: DetalleVenta, as: 'Detalles' }], // <-- CAMBIO AQUÍ
            order: [['fecha_venta', 'DESC']]
        });
        
        if (!ventas || ventas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ventas para este cliente' });
        }
        
        // 2. Recolectar IDs y obtener datos externos (usando el alias 'Detalles')
        const productoIds = [...new Set(ventas.flatMap(v => v.Detalles.map(d => d.id_producto)))]; // <-- CAMBIO AQUÍ

        const [clienteResponse, productosResponse] = await Promise.all([
            axios.get(`${CLIENTES_API_URL}/${id_cliente}`),
            Promise.all(productoIds.map(id => axios.get(`${PRODUCTOS_API_URL}/${id}`)))
        ]);

        const datosCliente = clienteResponse.data;
        const productosMap = new Map(productosResponse.map(r => [r.data.id_producto, r.data]));
        
        // 3. Componer la respuesta final (usando el alias 'Detalles')
        const historial_ventas = ventas.map(venta => {
            const detalles = venta.Detalles.map(detalle => { // <-- CAMBIO AQUÍ
                const producto = productosMap.get(detalle.id_producto);
                return {
                    cantidad: detalle.cantidad,
                    precio_unitario: detalle.precio_unitario,
                    subtotal: detalle.subtotal,
                    producto: {
                        nombre: producto.nombre,
                        descripcion: producto.descripcion
                    }
                };
            });

            return {
                id_venta: venta.id_venta,
                fecha_venta: venta.fecha_venta,
                total_venta: venta.total_venta,
                detalles
            };
        });

        res.status(200).json({
            cliente: {
                nombre: datosCliente.nombre,
                apellido: datosCliente.apellido,
                email: datosCliente.email
            },
            historial_ventas
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las ventas del cliente', error: error.message });
    }
};