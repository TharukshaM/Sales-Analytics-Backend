const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'sales-analytics',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'Tharu#12',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3307,
        dialect: 'mysql',
        logging: false,
    }
);

module.exports = sequelize;