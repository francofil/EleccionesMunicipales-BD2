const pool = require('../db/db');

// GET all
exports.getAllPresidentes = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Users WHERE tipo = "Presidente"');
  res.json(rows);
};

// GET one
exports.getOneCI = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Users WHERE ci = ?', [req.params.ci]);
  rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'No se encontro presidente con esa cedula de identidad' });
};

exports.getOneCC = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Users WHERE credencial = ?', [req.params.credencial]);
  rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'No se encontro presidente con esa credencial' });
};
// POST
/*
{
  "ci": "12345678",
  "credencial": "credencial123",
  "nombre": "Juan",
  "apellido": "Pérez",
  "fecha_nacimiento": "2000-04-15"
}
 */
exports.create = async (req, res) => {
  const { ci, credencial, nombre, apellido, tipo } = req.body;
  await pool.query(
    'INSERT INTO Users (ci, credencial, nombre, apellido, tipo) VALUES (?, ?, ?, ?, "Presidente")',
    [ci, credencial, nombre, apellido, tipo]
  );
  res.status(201).json({ message: 'Presidente creado' });
};


// PUT
exports.update = async (req, res) => {
  const { nombre, apellido } = req.body;
  await pool.query(
    'UPDATE Users SET nombre = ?, apellido = ? WHERE ci = ?',
    [nombre, apellido, req.params.ci]
  );
  res.json({ message: 'Presidente actualizado' });
};

// DELETE
exports.remove = async (req, res) => {
  await pool.query('DELETE FROM Users WHERE ci = ?', [req.params.ci]);
  res.json({ message: 'Presidente eliminado' });
};