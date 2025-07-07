const pool = require('../db/db');

// Crear nueva papeleta
exports.create = async (req, res) => {
  const { color, eleccion, idPartido } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO Papeleta (color, eleccion, idPartido) VALUES (?, ?, ?)',
      [color, eleccion, idPartido]
    );
    res.status(201).json({ message: 'Papeleta creada', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las papeletas
exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT Papeleta.*, Partido.nombre AS partidoNombre 
       FROM Papeleta 
       JOIN Partido ON Papeleta.idPartido = Partido.id`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener papeletas por elección
exports.getByEleccion = async (req, res) => {
  const { idEleccion } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT Papeleta.*, Partido.nombre AS partidoNombre 
       FROM Papeleta 
       JOIN Partido ON Papeleta.idPartido = Partido.id
       WHERE Papeleta.eleccion = ?`,
      [idEleccion]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
