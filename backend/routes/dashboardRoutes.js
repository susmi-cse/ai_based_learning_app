const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.get('/stats', protect, getDashboardStats);

module.exports = router;
