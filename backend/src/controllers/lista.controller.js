const pool = require('../db/db');

// Crear una nueva lista (subclase de papeleta)
exports.create = async (req, res) => {
  const { id, organo, departamento } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO Lista (id, organo, departamento) VALUES (?, ?, ?)',
      [id, organo, departamento]
    );
    res.status(201).json({ message: 'Lista creada', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar listas con info extendida por elección
exports.getByEleccion = async (req, res) => {
  const { idEleccion } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT Lista.*, Papeleta.color, Partido.nombre AS partidoNombre 
       FROM Lista 
       JOIN Papeleta ON Lista.id = Papeleta.id 
       JOIN Partido ON Papeleta.idPartido = Partido.id 
       WHERE Papeleta.eleccion = ?`,
      [idEleccion]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
