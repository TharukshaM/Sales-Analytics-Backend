const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const authenticateToken = require('../middleware/AuthMiddleware');

router.post('/login', authController.login);
router.post('/signup', authController.signup);

//protected route example
router.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: `Welcome user ${req.user.email}, this is protected data.` });
});

module.exports = router;