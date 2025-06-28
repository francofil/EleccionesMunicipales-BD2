const express = require('express');
const router = express.Router();
const controller = require('../controllers/eleccionCircuito.controller.js');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Obtener estado del circuito en una elección (acceso general)
router.get('/estado/:idEleccion/:idCircuito', authenticateToken, controller.getOne);

// Actualizar estado (cerrar/abrir mesa) - requiere presidente o admin
router.put('/estado/:idEleccion/:idCircuito', authenticateToken, authorizeRoles('admin', 'presidente'), controller.update);

// Agregar votante habilitado - requiere presidente o admin
router.post('/habilitados', authenticateToken, authorizeRoles('admin', 'presidente'), controller.create);

// Obtener todos los votantes habilitados (requiere login)
router.get('/habilitados/:idEleccion/:idCircuito', authenticateToken, controller.getAll);

// Verificar si una credencial está habilitada (requiere login)
router.get('/habilitados/:idEleccion/:idCircuito/:credencial', authenticateToken, controller.getOne);

module.exports = router;
