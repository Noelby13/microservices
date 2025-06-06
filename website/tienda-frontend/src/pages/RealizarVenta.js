// src/pages/RealizarVenta.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  Box,
  Divider,
  Badge
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getProductos, getClientes, createVenta } from '../api/services';

const RealizarVenta = () => {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState('');
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productosRes = await getProductos();
        setProductos(productosRes.data);
        const clientesRes = await getClientes();
        setClientes(clientesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const addToCart = (producto) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id_producto === producto.id_producto);
      if (existing) {
        return prevCart.map((item) =>
          item.id_producto === producto.id_producto ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prevCart, { ...producto, cantidad: 1 }];
    });
  };

  const removeFromCart = (id_producto) => {
    setCart(cart.filter(item => item.id_producto !== id_producto));
  };

  const handleFinalizeVenta = async () => {
    if (!selectedCliente || cart.length === 0) {
      setMessage({ type: 'error', text: 'Debe seleccionar un cliente y añadir productos al carrito.' });
      return;
    }
    const ventaData = {
      id_cliente: selectedCliente,
      productos: cart.map(item => ({ id_producto: item.id_producto, cantidad: item.cantidad }))
    };
    try {
      await createVenta(ventaData);
      setMessage({ type: 'success', text: '¡Venta realizada con éxito!' });
      setCart([]);
      setSelectedCliente('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al realizar la venta: ' + (error.response?.data?.message || '') });
    }
  };

  const totalCarrito = cart.reduce((total, item) => total + item.precio * item.cantidad, 0);

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      {message && (
        <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Panel de Productos */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>🛍️ Productos</Typography>
          <Grid container spacing={2}>
            {productos.map((producto) => (
              <Grid item key={producto.id_producto} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#fefefe' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{producto.nombre}</Typography>
                    <Typography variant="body2" color="text.secondary">{producto.descripcion}</Typography>
                    <Typography variant="body1" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>
                      ${producto.precio}
                    </Typography>
                    <Typography variant="caption">Stock: {producto.stock}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      startIcon={<AddShoppingCartIcon />}
                      onClick={() => addToCart(producto)}
                      disabled={producto.stock === 0}
                    >
                      Añadir
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Panel de Carrito / Resumen */}
        <Grid item xs={12} md={4}>
          <Paper elevation={4} sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: 2, position: 'sticky', top: '20px' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h5">🧾 Resumen de Venta</Typography>
              <Badge badgeContent={cart.length} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Seleccionar Cliente</InputLabel>
              <Select
                value={selectedCliente}
                label="Seleccionar Cliente"
                onChange={(e) => setSelectedCliente(e.target.value)}
              >
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
                    {cliente.nombre} {cliente.apellido}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6" gutterBottom>🛒 Carrito</Typography>
            <List dense>
              {cart.map((item) => (
                <ListItem
                  key={item.id_producto}
                  secondaryAction={
                    <IconButton edge="end" color="error" onClick={() => removeFromCart(item.id_producto)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={item.nombre}
                    secondary={`Cantidad: ${item.cantidad} | Subtotal: $${(item.precio * item.cantidad).toFixed(2)}`}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h5" align="right" sx={{ fontWeight: 'bold' }}>
              Total: ${totalCarrito.toFixed(2)}
            </Typography>

            <Button
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 2 }}
              onClick={handleFinalizeVenta}
            >
              Finalizar Venta
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RealizarVenta;
