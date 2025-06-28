const pool = require('../db/db');

// 🔍 Obtener el registro de un circuito asignado a una elección
exports.obtenerCircuitoDeEleccion = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM circuito_eleccion WHERE idEleccion = ? AND idCircuito = ?',
      [req.params.idEleccion, req.params.idCircuito]
    );
    rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'No se encontró ese circuito en la elección' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ➕ Añadir votante habilitado a un circuito en una elección
exports.añadirVotante = async (req, res) => {
  const { credencial, idEleccion, idCircuito } = req.body;
  try {
    const [rows] = await pool.query(
      'INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial) VALUES (?, ?, ?)',
      [idEleccion, idCircuito, credencial]
    );
    res.status(201).json({ message: 'Votante habilitado agregado', result: rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔄 Cambiar el estado (cerrar o abrir mesa) de un circuito de una elección
exports.cambiarEstadoMesa = async (req, res) => {
  const { mesaCerrada } = req.body;
  try {
    await pool.query(
      'UPDATE circuito_eleccion SET mesaCerrada = ? WHERE idEleccion = ? AND idCircuito = ?',
      [mesaCerrada, req.params.idEleccion, req.params.idCircuito]
    );
    res.json({ message: 'Estado del circuito actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📋 Obtener todas las credenciales habilitadas en un circuito de una elección
exports.getAllVotantesHabilitados = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT credencial FROM ListaVotacion_Circuito_Eleccion WHERE idEleccion = ? AND idCircuito = ?',
      [req.params.idEleccion, req.params.idCircuito]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Verificar si una credencial está habilitada en un circuito y elección
exports.getOneVotanteHabilitado = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT credencial FROM ListaVotacion_Circuito_Eleccion WHERE idEleccion = ? AND idCircuito = ? AND credencial = ?',
      [req.params.idEleccion, req.params.idCircuito, req.params.credencial]
    );

    if (rows.length > 0) {
      res.json({ habilitado: true });
    } else {
      res.status(404).json({ habilitado: false });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
