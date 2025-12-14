const express = require('express');
const router = express.Router();
const salesController = require('../controllers/SalesController');
const upload = require('../middleware/UploadMiddleware');
const authenticateToken = require('../middleware/AuthMiddleware');


router.post(
    '/upload', 
    authenticateToken, 
    upload.single('file'), // 'file' must match the key used in Postman/Frontend
    salesController.uploadSales
);

router.get('/upload-history', authenticateToken, salesController.getUploadHistory);

module.exports = router;