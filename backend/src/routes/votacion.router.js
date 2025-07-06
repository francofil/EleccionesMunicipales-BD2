const express = require('express');
const router = express.Router();
const controller = require('../controllers/votacion.controller');
const { authenticateToken } = require('../middleware/authMiddleware'); // IMPORTACIÓN correcta

router.put('/cerrarMesa/:idEleccion/:idCircuito', authenticateToken, controller.cerrarMesa);

module.exports = router;
