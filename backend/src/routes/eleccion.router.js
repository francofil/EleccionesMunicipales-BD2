// backend/src/routes/eleccion.router.js

const express = require('express');
const router = express.Router();
const eleccionController = require('../controllers/eleccion.controller'); // Asegurate de que el archivo del controller se llame así

// Obtener todas las elecciones
router.get('/', eleccionController.getAll);

// Obtener una elección por ID
router.get('/:id', eleccionController.getOne);

// Crear una nueva elección
router.post('/', eleccionController.create);

// Actualizar una elección existente
router.put('/:id', eleccionController.update);

// Eliminar una elección
router.delete('/:id', eleccionController.remove);

module.exports = router;
