const pool = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
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
    const [result] = await pool.query(`INSERT INTO Usuario (ci, username, password, rol) VALUES (?, ?, ?, ?)`,
      [ci, username, hashed, rol]
    );

    res.status(201).json({ message: 'Usuario creado' });
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};

//POST
exports.login = async (req, res) => {
  const {
    username,
    password
  } = req.body;
  try {
    const [rows] = await pool.query(`SELECT * FROM Usuario WHERE username = ?`,
      [username]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = rows[0];
    valido = await bcrypt.compare(password, user.password);

    if (!valido) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    } 
    
    const token = jwt.sign(
      { ci: user.ci, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );


    res.status(201).json({ message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

