// src/pages/VisualizarVentas.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Alert,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { getVentas } from '../api/services';

// Animación de rotación del icono
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const VisualizarVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await getVentas();
        setVentas(response.data);
      } catch (err) {
        setError("No se pudieron cargar las ventas.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVentas();
  }, []);

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>🧾 Historial de Ventas</Typography>
      {ventas.length === 0 ? (
        <Typography>No hay ventas para mostrar.</Typography>
      ) : (
        ventas.map((venta) => (
          <Card key={venta.id_venta} sx={{ mb: 3, backgroundColor: '#ffffff', boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Venta #{venta.id_venta}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>💰 ${venta.total_venta}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary">
                🧍 Cliente: {venta.cliente.nombre} {venta.cliente.apellido}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                🗓️ Fecha: {venta.fecha || 'Sin fecha disponible'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📦 Productos: {venta.detalles.length}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <ExpandMore
                expand={expandedId === venta.id_venta}
                onClick={() => handleExpandClick(venta.id_venta)}
                aria-expanded={expandedId === venta.id_venta}
                aria-label="Ver detalles"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expandedId === venta.id_venta} timeout="auto" unmountOnExit>
              <CardContent>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Producto</strong></TableCell>
                        <TableCell align="right"><strong>Cantidad</strong></TableCell>
                        <TableCell align="right"><strong>Precio Unit.</strong></TableCell>
                        <TableCell align="right"><strong>Subtotal</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {venta.detalles.map((detalle, index) => (
                        <TableRow key={index}>
                          <TableCell>{detalle.producto.nombre}</TableCell>
                          <TableCell align="right">{detalle.cantidad}</TableCell>
                          <TableCell align="right">${detalle.precio_unitario}</TableCell>
                          <TableCell align="right">${detalle.subtotal}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Collapse>
          </Card>
        ))
      )}
    </Container>
  );
};

export default VisualizarVentas;
