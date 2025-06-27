const pool = require('../db/db');

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

    const token = jwt.sign(
      { ci: user.ci, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    res.status(201).json({ message: 'Circuito creado', toke, });
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};

//POST
exports.create = async (req, res) => {
  const {
    username,
    password
  } = req.body;

  try {
    const [contraseña] = await pool.query(`SELECT contraseña FROM Usuario WHERE username = ?`,
      [username]
    );

    if (contraseña.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    valido = await bcrypt.compare(password, contraseña[0]);

    if (!valido) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    } else {

    }


    res.status(201).json({ message: 'Login exitoso', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

