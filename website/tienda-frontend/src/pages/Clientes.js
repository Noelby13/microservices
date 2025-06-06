// src/pages/Clientes.js
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { createCliente } from '../api/services';

const Clientes = () => {
  const [formData, setFormData] = useState({ nombre: '', apellido: '', email: '', direccion: '', telefono: '' });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCliente(formData);
      setMessage({ type: 'success', text: '¡Cliente creado con éxito!' });
      setFormData({ nombre: '', apellido: '', email: '', direccion: '', telefono: '' }); // Limpiar formulario
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al crear el cliente. ' + (error.response?.data?.message || '') });
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Añadir Nuevo Cliente</Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField margin="normal" required fullWidth label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
        <TextField margin="normal" required fullWidth label="Apellido" name="apellido" value={formData.apellido} onChange={handleChange} />
        <TextField margin="normal" required fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
        <TextField margin="normal" fullWidth label="Dirección" name="direccion" value={formData.direccion} onChange={handleChange} />
        <TextField margin="normal" fullWidth label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Guardar Cliente</Button>
      </Box>
      {message && <Alert severity={message.type} sx={{ mt: 2 }}>{message.text}</Alert>}
    </Container>
  );
};

export default Clientes;