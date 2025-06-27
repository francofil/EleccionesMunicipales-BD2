const pool = require('../db/db');

// POST
exports.create = async (req, res) => {
  const {
    ci,
    username,
    password,
    rol
  } = req.body;

  if (rol !== 'admin' && rol !== 'presidente') {
    return res.status(400).json({ error: 'Rol inválido. Debe ser "admin" o "presidente"' });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(`INSERT INTO Circuito (ci, username, password, rol) VALUES (?, ?, ?, ?)`,
      [ci, username, hashed, rol]
    );

    res.status(201).json({ message: 'Circuito creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
