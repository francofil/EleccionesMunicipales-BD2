const express = require('express');
const router = express.Router();
const votanteController = require('../controllers/votantes.controller.js');

//Todos los votantes
router.get('/votantes', votanteController.getAll);
//Creacion votante
router.post('/votantes', votanteController.create);
//Votante por cedula de identidad
router.get('/votantes/:ci', votanteController.getOneCI);
//Votante por credencial
router.get('/votantes/:cc', votanteController.getOneCC);


module.exports = router;