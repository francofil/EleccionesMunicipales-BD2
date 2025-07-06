const express = require("express");
const router = express.Router();
const controller = require("../controllers/votacion.controller.js"); // o resultados.controller.js

// Ejemplo de uso: /resultados/lista-mas-votada?idEleccion=1&idCircuito=2
router.get("/lista-mas-votada", controller.getListaMasVotada);

//DEvuelve los votos que tuvo un partido en un circuito
router.get("/votos-por-partido", controller.getVotosPorPartido);

// 3. Resultados por circuito (elección + circuito)
router.get('/resultadosCircuito/:idEleccion/:idCircuito', votacionController.getResultadosPorCircuito);

module.exports = router;
