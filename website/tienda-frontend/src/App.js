import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container } from '@mui/material';
import Navigation from './components/Navigation';
import RealizarVenta from './pages/RealizarVenta';
import Clientes from './pages/Clientes';
import VisualizarVentas from './pages/VisualizarVentas';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Navigation />
      <Container component="main" maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<RealizarVenta />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/ventas" element={<VisualizarVentas />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;