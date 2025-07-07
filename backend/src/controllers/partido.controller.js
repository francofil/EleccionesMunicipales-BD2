const pool = require('../db/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Partido');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};