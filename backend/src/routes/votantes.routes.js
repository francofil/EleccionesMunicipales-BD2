const express = require('express');
const router = express.Router();
const votanteController = require('../controllers/votantes.controller.js');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Obtener todos los votantes (requiere login)
router.get('/', authenticateToken, votanteController.getAll);

// Crear votante (solo admin o presidente)
router.post('/', authenticateToken, authorizeRoles('admin', 'presidente'), votanteController.create);

// Obtener votante por cédula
router.get('/:ci', authenticateToken, votanteController.getOneCI);

// Obtener votante por credencial
router.get('/credencial/:cc', authenticateToken, votanteController.getOneCC);

//module.exports = router;


const { authenticateToken } = require('../middleware/authMiddleware');
const db = require('../db/db');

// 1. Estado del voto de un votante
router.get('/estado/:credencial/:idEleccion/:idCircuito', authenticateToken, async (req, res) => {
  const { credencial, idEleccion, idCircuito } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT fueEmitido, esObservado 
       FROM Votante_Circuito_Eleccion 
       WHERE credencial = ? AND idEleccion = ? AND idCircuito = ?`,
      [credencial, idEleccion, idCircuito]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'No hay información de voto' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al consultar estado del votante' });
  }
});

// 2. Estado general de la mesa
router.get('/estadoMesa/:idEleccion/:idCircuito', authenticateToken, async (req, res) => {
  const { idEleccion, idCircuito } = req.params;

  try {
    const [[mesa]] = await db.query(
      `SELECT mesaCerrada FROM Circuito_Eleccion 
       WHERE idEleccion = ? AND idCircuito = ?`,
      [idEleccion, idCircuito]
    );

    const [[habilitados]] = await db.query(
      `SELECT COUNT(*) as total 
       FROM ListaVotacion_Circuito_Eleccion 
       WHERE idEleccion = ? AND idCircuito = ?`,
      [idEleccion, idCircuito]
    );

    const [[emitidos]] = await db.query(
      `SELECT COUNT(*) as total 
       FROM Votante_Circuito_Eleccion 
       WHERE idEleccion = ? AND idCircuito = ? AND fueEmitido = true`,
      [idEleccion, idCircuito]
    );

    res.json({
      mesaCerrada: mesa?.mesaCerrada ?? null,
      habilitados: habilitados.total,
      emitidos: emitidos.total
    });
  } catch (err) {
    res.status(500).json({ message: 'Error al consultar estado del circuito' });
  }
});

// Obtener circuito y elección asignados a un votante
router.get('/asignacion/:credencial', authenticateToken, async (req, res) => {
  const { credencial } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT idEleccion, idCircuito 
       FROM ListaVotacion_Circuito_Eleccion 
       WHERE credencial = ? 
       LIMIT 1`, [credencial]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró circuito para esta credencial' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener asignación de circuito/elección' });
  }
});


module.exports = router;
