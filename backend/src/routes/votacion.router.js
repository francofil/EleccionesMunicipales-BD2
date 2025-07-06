const express = require('express');
const router = express.Router();

const controller = require('../controllers/votacion.controller');

router.put('/cerrarMesa/:idEleccion/:idCircuito', authMiddleware, controller.cerrarMesa);
