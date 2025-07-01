const express = require('express');
const router = express.Router();
const circuitoController = require('../controllers/circuito.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Obtener todos los circuitos
router.get('/', authenticateToken, circuitoController.getAll);

// Obtener un circuito específico
router.get('/:id', authenticateToken, circuitoController.getOne);

// Crear un nuevo circuito (solo admin o presidente)
router.post('/', authenticateToken, authorizeRoles('admin', 'presidente'), circuitoController.create);

// Actualizar un circuito (solo admin o presidente)
router.put('/:id', authenticateToken, authorizeRoles('admin', 'presidente'), circuitoController.update);

// Eliminar un circuito (solo admin o presidente)
router.delete('/:id', authenticateToken, authorizeRoles('admin', 'presidente'), circuitoController.remove);

// Obtener los votantes de un circuito
router.get('/:id/votantes', authenticateToken, circuitoController.getVotantesByCircuito);

module.exports = router;
