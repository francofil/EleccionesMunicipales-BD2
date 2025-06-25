const pool = require('../db/db');
// GET status
exports.getOne = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM circuito_eleccion WHERE idEleccion = ? AND idCircuito = ?', [req.params.idEleccion, req.params.idCircuito]);
  rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'No se encontro el ningun circuito con esos parametros asociado a esa eleccion' });
};

// añadir votantes a un circuito de una eleccion
exports.create = async (req, res) => {
  const { credencial, idEleccion, idCircuito } = req.body;
  const [rows] = await pool.query('INSERT INTO ListaVotacion_Circuito_Eleccion ( idEleccion, idCircuito, credencial) VALUES (?, ?, ?)', [idEleccion, idCircuito, credencial]);
  res.json(rows);
}

// PUT
exports.update = async (req, res) => {
  const {mesaCerrada} = req.body;
  await pool.query(
    'UPDATE circuito_eleccion SET mesaCerrada = ? WHERE idEleccion = ? AND idCircuito = ?',
    [mesaCerrada, req.params.idEleccion, req.params.idCircuito]
  );
  res.json({ message: 'Estado del circuito actualizado' });
};

// Habilitados a votar en ese circuito de esa eleccion 
exports.getAll = async (req, res) => {
  const [rows] = await pool.query('SELECT credencial FROM ListaVotacion_Circuito_Eleccion WHERE idEleccion = ? AND idCircuito = ?', [req.params.idEleccion, req.params.idCircuito]);
  res.json(rows);
}

// Tal votante esta habilitado a votar
exports.getOne = async (req, res) => {
  const [rows] = await pool.query('SELECT credencial FROM ListaVotacion_Circuito_Eleccion WHERE idEleccion = ? AND idCircuito = ? AND credencial = ?', [req.params.idEleccion, req.params.idCircuito, req.params.credencial]);
  res.json(rows);
}