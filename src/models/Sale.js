const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Sale = sequelize.define('Sale', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    transactionDate: {
        type: Sequelize.DATEONLY, // Matches YYYY-MM-DD
        allowNull: false
    },
    customer: {
        type: Sequelize.STRING,
        allowNull: false
    },
    product: {
        type: Sequelize.STRING,
        allowNull: false
    },
    region: {
        type: Sequelize.STRING,
        allowNull: false
    },
    amount: { // "Sales" column
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    units: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    // We add this to know WHO uploaded the file
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

// Relationships
User.hasMany(Sale, { foreignKey: 'userId' });
Sale.belongsTo(User, { foreignKey: 'userId' });

module.exports = Sale;