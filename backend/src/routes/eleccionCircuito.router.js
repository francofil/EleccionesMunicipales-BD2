const express = require('express');
const router = express.Router();
const controller = require('../controllers/eleccionCircuito.controller.js');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Obtener estado del circuito en una elección (acceso general)
router.get('/estado/:idEleccion/:idCircuito', authenticateToken, controller.obtenerCircuitoDeEleccion);

// Actualizar estado (cerrar/abrir mesa) - requiere presidente o admin
router.put('/estado/:idEleccion/:idCircuito', authenticateToken, authorizeRoles('admin', 'presidente'), controller.cambiarEstadoMesa);

// Agregar votante habilitado - requiere presidente o admin
router.post('/habilitados', authenticateToken, authorizeRoles('admin', 'presidente'), controller.añadirVotante);

// Obtener todos los votantes habilitados (requiere login)
router.get('/habilitados/:idEleccion/:idCircuito', authenticateToken, controller.getAllVotantesHabilitados);

// Verificar si una credencial está habilitada (requiere login)
router.get('/habilitados/:idEleccion/:idCircuito/:credencial', authenticateToken, controller.getOneVotanteHabilitado);

//VEr estado de la mesa, cerrada, abierta, observados, emitidoos, totales
router.get('/estado/:idEleccion/:idCircuito', authenticateToken, controller.getEstado);

router.post('/vincular', authenticateToken, authorizeRoles('admin'), controller.vincularCircuitoAEleccion);

module.exports = router;
