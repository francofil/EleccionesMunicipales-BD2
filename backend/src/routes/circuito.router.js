const express = require('express');
const router = express.Router();
const circuitoController = require('../controllers/circuito.controller');

// Obtener todos los circuitos
router.get('/', circuitoController.getAll);

// Obtener un circuito específico (acá podrías usar getById si lo querés separado de votantes)
router.get('/:id', circuitoController.getOne);

// Crear un nuevo circuito
router.post('/', circuitoController.create);

//  Actualizar un circuito existente
router.put('/:id', circuitoController.update);

// Eliminar un circuito
router.delete('/:id', circuitoController.remove);

//Obtener los votantes de un circuito
router.get('/:id/votantes', circuitoController.getVotantesByCircuito);

module.exports = router;
