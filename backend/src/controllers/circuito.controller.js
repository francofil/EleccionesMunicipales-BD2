const pool = require('../db/db');

// GET all
exports.getAll = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Circuito');
  res.json(rows);
};

// GET one
exports.getOne = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT Votante.*
     FROM Votante
     JOIN ListaVotacion_Circuito_Eleccion AS L ON L.credencial = Votante.credencial
     WHERE L.idCircuito = ?`,
    [req.params.idCircuito]
  );

  rows.length
    ? res.json(rows)
    : res.status(404).json({ error: 'No se encontraron votantes con ese circuito asignado' });
};


exports.create = async (req, res) => {
  const { zona, tipo, accesible, direccion, idEstablecimiento, idDepartamento } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO Circuito (zona, tipo, accesible, direccion, idEstablecimiento, idDepartamento) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [zona, tipo, accesible, direccion, idEstablecimiento, idDepartamento]
    );

    res.status(201).json({ message: 'Circuito creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT
exports.update = async (req, res) => {
  const { zona, tipo, accesible, direccion } = req.body;
  try {
    await pool.query(
      'UPDATE Circuito SET zona = ?, tipo = ?, accesible = ?, direccion = ? WHERE id = ?',
      [zona, tipo, accesible, direccion, req.params.id]
    );
    res.json({ message: 'Circuito actualizado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// DELETE
exports.remove = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM ListaVotacion_Circuito_Eleccion WHERE idCircuito = ?", [id]);
    await pool.query("DELETE FROM Circuito_Eleccion WHERE idCircuito = ?", [id]);
    await pool.query("DELETE FROM Votante_Circuito_Eleccion WHERE idCircuito = ?", [id]);
    await pool.query("DELETE FROM Voto WHERE idCircuito = ?", [id]);
    await pool.query("DELETE FROM Circuito WHERE id = ?", [id]);

    res.json({ message: 'Circuito eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el circuito' });
  }
};

// GET todos los votantes de un circuito
exports.getVotantesByCircuito = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID de circuito inválido" });

  try {
    const [rows] = await pool.query(
      `SELECT Votante.*
       FROM Votante
       JOIN ListaVotacion_Circuito_Eleccion AS L 
         ON L.credencial = Votante.credencial
       WHERE L.idCircuito = ?`,
      [id]
    );

    rows.length
      ? res.json(rows)
      : res.status(404).json({ error: "No se encontraron votantes para ese circuito" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
