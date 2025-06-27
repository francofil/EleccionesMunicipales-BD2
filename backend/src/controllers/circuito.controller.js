const pool = require('../db/db');

// GET all
exports.getAll = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Circuitos');
  res.json(rows);
};

// GET one
exports.getOne = async (req, res) => {
  const [rows] = await pool.query('SELECT votantes.* FROM Votantes JOIN ListaVotacion_Circuito_Eleccion AS L ON L.credencial = votante.credencial WHERE idCircuito = ?', [req.params.idCircuito]);
  rows.length ? res.json(rows[0]) : res.status(404).json({ error: 'No se encontraron votantes con ese circuito asignado' });
};


exports.create = async (req, res) => {
  // Validar que se reciban todos los campos necesarios, asocia cada variable con el campo que viene en el body de la petición
  const {
    zona,
    tipo,
    accesible,
    direccion,
    idEstablecimiento,
    ciAgente,
    idDepartamento,
    idMesa
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO Circuito (zona, tipo, accesible, direccion, idEstablecimiento, ciAgente, idDepartamento, idMesa) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [zona, tipo, accesible, direccion, idEstablecimiento, ciAgente, idDepartamento, idMesa]
    );

    res.status(201).json({ message: 'Circuito creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT
exports.update = async (req, res) => {
  const {zona, tipo, accesible, direccion } = req.body;
  await pool.query(
    'UPDATE Circuitos SET zona = ?, tipo = ?, accesible = ?, direccion = ? WHERE id = ?',
    [zona, tipo, accesible, direccion, req.params.id]
  );
  res.json({ message: 'Circuito actualizado' });
};

// DELETE
exports.remove = async (req, res) => {
  await pool.query('DELETE FROM Circuitos WHERE id = ?', [req.params.id]);
  res.json({ message: 'Circuito eliminado' });
};

// GET todos los votantes de un circuito
exports.getVotantesByCircuito = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID de circuito inválido" });
  }
  try {
    const [rows] = await pool.query(
      `SELECT Votante.*
       FROM Votante
       JOIN ListaVotacion_Circuito_Eleccion AS L 
         ON L.credencial = Votante.credencial
       WHERE L.idCircuito = ?`,
      [id]
    );

    if (rows.length) {
      res.json(rows);
    } else {
      res
        .status(404)
        .json({ error: "No se encontraron votantes para ese circuito" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
