const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const UploadLog = sequelize.define('UploadLog', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fileName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fileSize: {
        type: Sequelize.STRING, // e.g., "2.4 MB"
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('Processing', 'Success', 'Failed'),
        defaultValue: 'Processing'
    },
    uploadDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});
User.hasMany(UploadLog, { foreignKey: 'userId' });
UploadLog.belongsTo(User, { foreignKey: 'userId' });

module.exports = UploadLog;