const fs = require('fs');
const csv = require('csv-parser');
const Sale = require('../models/Sale');

exports.uploadSales = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a CSV file' });
        }

        const salesData = [];
        const filePath = req.file.path;

        // 1. Read and Parse the CSV File
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                // Map CSV columns to Database Columns
                // Assuming CSV headers are: date, customer, product, region, sales, units
                salesData.push({
                    transactionDate: row.date, // "date" from CSV
                    customer: row.customer,
                    product: row.product,
                    region: row.region,
                    amount: parseFloat(row.sales), // "sales" from CSV
                    units: parseInt(row.units),
                    userId: req.user.id // Linked to the logged-in user
                });
            })
            .on('end', async () => {
                try {
                    // 2. Bulk Insert into Database
                    await Sale.bulkCreate(salesData);
                    
                    // 3. Remove the file after processing (Optional)
                    fs.unlinkSync(filePath);

                    res.status(201).json({ 
                        message: 'File processed successfully', 
                        recordsHelper: salesData.length 
                    });
                } catch (error) {
                    console.error('Database Insert Error:', error);
                    res.status(500).json({ error: 'Failed to save sales data' });
                }
            });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};