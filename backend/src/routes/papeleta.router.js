const express = require('express');
const router = express.Router();
const controller = require('../controllers/papeleta.controller');

router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/eleccion/:idEleccion', controller.getByEleccion);

module.exports = router;
