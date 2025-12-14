const express = require('express');
const router = express.Router();
const salesController = require('../controllers/SalesController');
const upload = require('../middleware/UploadMiddleware');
const authenticateToken = require('../middleware/AuthMiddleware');

// POST /api/sales/upload
// 1. Check Token -> 2. Handle File Upload -> 3. Process CSV
router.post(
    '/upload', 
    authenticateToken, 
    upload.single('file'), // 'file' must match the key used in Postman/Frontend
    salesController.uploadSales
);

module.exports = router;