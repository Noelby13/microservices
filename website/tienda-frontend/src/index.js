import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// 1. Encuentra el elemento 'root' en tu HTML.
const root = ReactDOM.createRoot(document.getElementById('root'));

// 2. Renderiza tu aplicación principal (<App />) dentro de ese elemento.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);