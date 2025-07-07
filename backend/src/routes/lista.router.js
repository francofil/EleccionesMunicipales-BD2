const express = require('express');
const router = express.Router();
const controller = require('../controllers/lista.controller');

router.post('/', controller.create);
router.get('/eleccion/:idEleccion', controller.getByEleccion);

module.exports = router;
