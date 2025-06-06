// src/components/Navigation.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';

const Navigation = () => {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Microservicios
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/" startIcon={<ShoppingCartIcon />}>
            Realizar Venta
          </Button>
          <Button color="inherit" component={RouterLink} to="/clientes" startIcon={<PeopleIcon />}>
            Añadir Cliente
          </Button>
          <Button color="inherit" component={RouterLink} to="/ventas" startIcon={<ReceiptIcon />}>
            Visualizar Ventas
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;