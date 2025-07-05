const express = require('express')
const router = express.Router();
module.exports = router;
const controller = require('../controllers/votacion.controller');

router.put('/cerrarMesa/:idEleccion/:idCircuito', authMiddleware, controller.cerrarMesa);
