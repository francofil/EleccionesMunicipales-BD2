const pool = require('../db/db');
// GET status
exports.getOne = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM circuito_eleccion WHERE idEleccion = ? AND idCircuito = ?', [req.params.idEleccion, req.params.idCircuito]);
  rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'No se encontro el ningun circuito con esos parametros asociado a esa eleccion' });
};

// PUT
exports.update = async (req, res) => {
  const {mesaCerrada} = req.body;
  await pool.query(
    'UPDATE circuito_eleccion SET mesaCerrada = ? WHERE idEleccion = ? AND idCircuito = ?',
    [mesaCerrada, req.params.idEleccion, req.params.idCircuito]
  );
  res.json({ message: 'Estado del circuito actualizado' });
};