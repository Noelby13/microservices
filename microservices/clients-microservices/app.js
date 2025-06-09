const express = require('express');
const cors = require('cors');
const clienteRoutes = require('./routes/clienteRoutes');
const {
    connectToDatabase,
    sequelize
} = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Logging middleware para rastrear cada petición
app.use((req, res, next) => {
    const now = new Date().toISOString();
    const { method, url, ip } = req;
    console.log(`[${now}] ${method} ${url} - IP: ${ip}`);
    next();
});

// Rutas
app.use('/clientes', clienteRoutes);

// Conexión a la base de datos y arranque del servidor
async function startServer() {
    await connectToDatabase();
    // await sequelize.sync({ force: false });
    app.listen(PORT, () => {
        console.log(`Client microservice running on port ${PORT}`);
    });
}

startServer();
