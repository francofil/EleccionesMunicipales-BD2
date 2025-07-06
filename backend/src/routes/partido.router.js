// routes/partido.router.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/partido.controller');

// Obtener todos los partidos existentes (pre-cargados)
router.get('/', controller.getAll);

module.exports = router;
