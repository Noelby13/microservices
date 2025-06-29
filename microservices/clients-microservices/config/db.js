// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false // Set to true to see SQL queries in console
    }
);

async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL database with Sequelize!');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

module.exports = {
    sequelize,
    connectToDatabase
};