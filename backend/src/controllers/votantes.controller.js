const pool = require('../db/db');

// GET all
exports.getAll = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Votantes');
  res.json(rows);
};

// GET one
exports.getOne = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Votantes WHERE ci = ?', [req.params.ci]);
  rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'No encontrado' });
};

// POST
exports.create = async (req, res) => {
  const { ci, nombre, apellido, fecha_nacimiento } = req.body;
  await pool.query(
    'INSERT INTO Votantes (ci, nombre, apellido, fecha_nacimiento) VALUES (?, ?, ?, ?)',
    [ci, nombre, apellido, fecha_nacimiento]
  );
  res.status(201).json({ message: 'Votante creado' });
};

// PUT
exports.update = async (req, res) => {
  const { nombre, apellido, fecha_nacimiento } = req.body;
  await pool.query(
    'UPDATE Votantes SET nombre = ?, apellido = ?, fecha_nacimiento = ? WHERE ci = ?',
    [nombre, apellido, fecha_nacimiento, req.params.ci]
  );
  res.json({ message: 'Votante actualizado' });
};

// DELETE
exports.remove = async (req, res) => {
  await pool.query('DELETE FROM Votantes WHERE ci = ?', [req.params.ci]);
  res.json({ message: 'Votante eliminado' });
};
