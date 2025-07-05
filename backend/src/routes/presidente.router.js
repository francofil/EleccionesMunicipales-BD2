const express = require('express');
const router = express.Router();
const controller = require('../controllers/eleccionCircuito.controller');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /presidente/circuito/:ci
router.get('/circuito/:ci', authenticateToken, controller.getCircuitoDelPresidente);

module.exports = router;
