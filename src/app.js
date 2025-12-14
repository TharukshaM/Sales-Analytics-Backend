const express = require('express');
const sequelize = require('./config/db'); // Import the DB connection
const authRoutes = require('./routes/AuthRoutes'); // Import the routes
require('dotenv').config(); // Load environment variables
const salesRoutes = require('./routes/SalesRoutes');

const app = express();

// 1. Middleware
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);


sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synced successfully.');
        
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to sync database:', err);
    });

module.exports = app;