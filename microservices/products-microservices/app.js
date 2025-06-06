// app.js
const express = require('express');
const cors = require('cors'); // <-- 1. Importa cors

const productRoutes = require('./routes/productRoutes');
const {
    connectToDatabase,
    sequelize
} = require('./config/db'); // Adjust based on your db.js export
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// Middleware
app.use(express.json()); // For parsing application/json

// Routes
app.use('/products', productRoutes);

// Database connection and server start
async function startServer() {
    await connectToDatabase();
    // If using Sequelize, you might want to sync models
    // await sequelize.sync({ force: false }); // `force: true` drops tables and recreates them (use with caution!)
    // console.log("All models were synchronized successfully.");

    app.listen(PORT, () => {
        console.log(`Product microservice running on port ${PORT}`);
    });
}

startServer();