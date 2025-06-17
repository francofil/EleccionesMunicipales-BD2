const express = require('express');
const router = express.Router();
const votanteController = require('../controllers/votante.controller');

router.get('/', votanteController.getAll);
router.post('/', votanteController.create);

module.exports = router;