const express = require('express')
const router = express.Router();
const controller = require('../controllers/votacion.controller');

// POST /votacion/emitir - Registrar constancia de voto (sin guardar el voto)
router.post('/emitir', controller.emitirConstanciaVoto);

// POST /votacion/secreto - Guardar el voto de forma anónima (estructura preparada)
router.post('/secreto', controller.guardarVotoSecreto);

module.exports = router;