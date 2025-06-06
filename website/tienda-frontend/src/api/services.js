// src/api/services.js
import axios from 'axios';

const CLIENTES_API_URL = 'http://192.168.1.101:3001/clientes';
const PRODUCTOS_API_URL = 'http://192.168.1.101:3002/products';
const VENTAS_API_URL = 'http://192.168.1.101:3000/venta'; // Asumiendo que el servicio de ventas corre en el puerto 3000

// --- Cliente Service ---
export const getClientes = () => axios.get(CLIENTES_API_URL);
export const createCliente = (cliente) => axios.post(CLIENTES_API_URL, cliente);

// --- Producto Service ---
export const getProductos = () => axios.get(PRODUCTOS_API_URL);

// --- Venta Service ---
export const getVentas = () => axios.get(VENTAS_API_URL);
export const createVenta = (venta) => axios.post(VENTAS_API_URL, venta);