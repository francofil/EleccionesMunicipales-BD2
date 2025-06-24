const express = require('express');
const router = express.Router();
const votanteController = require('../controllers/votantes.controller.js');

router.get('/', votanteController.getAll);
router.post('/', votanteController.create);
router.get('/:ci', votanteController.getOneCI);
router.get('/:cc', votanteController.getOneCC);

module.exports = router;