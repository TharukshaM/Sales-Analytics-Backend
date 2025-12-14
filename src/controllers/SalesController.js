const fs = require('fs');
const csv = require('csv-parser');
const Sale = require('../models/Sale');
const formatFileSize = require('../Helpers/FormatFileSize');
const UploadLog = require('../models/UploadLog');

exports.uploadSales = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a CSV file' });
        }

        const filePath = req.file.path;
        
        // 1. Create the "Recent Upload" Log entry (Status: Processing)
        const newUpload = await UploadLog.create({
            fileName: req.file.originalname,
            fileSize: formatFileSize(req.file.size),
            status: 'Processing',
            userId: req.user.id
        });

        const salesData = [];

        // 2. Process the CSV
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                salesData.push({
                    transactionDate: row.date,
                    customer: row.customer,
                    product: row.product,
                    region: row.region,
                    amount: parseFloat(row.sales),
                    units: parseInt(row.units),
                    userId: req.user.id
                });
            })
            .on('end', async () => {
                try {
                    // 3. Save Sales Data
                    await Sale.bulkCreate(salesData);
                    
                    // 4. Update Log Status to "Success"
                    await newUpload.update({ status: 'Success' });
                    
                    fs.unlinkSync(filePath); // Cleanup file

                    res.status(201).json({ 
                        message: 'File processed successfully', 
                        uploadId: newUpload.id 
                    });
                } catch (error) {
                    // If DB insert fails, mark as Failed
                    await newUpload.update({ status: 'Failed' });
                    console.error('Database Error:', error);
                    res.status(500).json({ error: 'Failed to save sales data' });
                }
            });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getUploadHistory = async (req, res) => {
    try {
        const history = await UploadLog.findAll({
            where: { userId: req.user.id },
            order: [['uploadDate', 'DESC']], // Newest first
            limit: 5 // Only show last 5 uploads (like the screenshot)
        });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};