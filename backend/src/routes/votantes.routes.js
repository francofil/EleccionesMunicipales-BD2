const express = require('express');
const router = express.Router();
const votanteController = require('../controllers/votantes.controller.js');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Obtener todos los votantes (requiere login)
router.get('/', authenticateToken, votanteController.getAll);

// Crear votante (solo admin o presidente)
router.post('/', authenticateToken, authorizeRoles('admin', 'presidente'), votanteController.create);

// Obtener votante por cédula
router.get('/:ci', authenticateToken, votanteController.getOneCI);

// Obtener votante por credencial
router.get('/credencial/:cc', authenticateToken, votanteController.getOneCC);

module.exports = router;
