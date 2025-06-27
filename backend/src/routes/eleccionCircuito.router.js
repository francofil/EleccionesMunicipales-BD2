const express = require('express');
const router = express.Router();
const controller = require('../controllers/eleccionCircuito.controller.js');

// 🔹 Obtener estado del circuito en una elección
router.get('/estado/:idEleccion/:idCircuito', controller.getOne);

// 🔹 Actualizar el estado (cerrar/abrir mesa)
router.put('/estado/:idEleccion/:idCircuito', controller.update);

// 🔹 Agregar votante habilitado a una elección y circuito
router.post('/habilitados', controller.create);

// 🔹 Obtener todos los votantes habilitados
router.get('/habilitados/:idEleccion/:idCircuito', controller.getAll);

// 🔹 Verificar si una credencial está habilitada
router.get('/habilitados/:idEleccion/:idCircuito/:credencial', controller.getOne);

module.exports = router;
