const pool = require('../db/db');

// Obtener todas las elecciones
exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Eleccion');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una elección por ID
exports.getOne = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Eleccion WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Elección no encontrada' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una elección
exports.create = async (req, res) => {
  const { fecha, tipo } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO Eleccion (fecha, tipo) VALUES (?, ?)', [fecha, tipo]);
    res.status(201).json({ message: 'Elección creada', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una elección
exports.update = async (req, res) => {
  const { fecha, tipo } = req.body;
  try {
    await pool.query('UPDATE Eleccion SET fecha = ?, tipo = ? WHERE id = ?', [fecha, tipo, req.params.id]);
    res.json({ message: 'Elección actualizada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una elección
exports.remove = async (req, res) => {
  try {
    await pool.query('DELETE FROM Eleccion WHERE id = ?', [req.params.id]);
    res.json({ message: 'Elección eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
