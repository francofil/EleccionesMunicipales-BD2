const pool = require("../db/db");

// GET all
exports.getAll = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Votante");
  res.json(rows);
};


// GET one
exports.getOneCI = async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM Votante WHERE ci = ?", [
    req.params.ci,
  ]);
  rows.length
    ? res.json(rows[0])
    : res
        .status(404)
        .json({ error: "No se encontro votante con esa cedula de identidad" });
};

exports.getOneCC = async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM Votante WHERE credencial = ?",
    [req.params.cc]
  );
  rows.length
    ? res.json(rows[0])
    : res
        .status(404)
        .json({ error: "No se encontro votante con esa credencial" });
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
  const { ci, credencial, nombre, apellido, fecha_nacimiento } = req.body;
  await pool.query(
    "INSERT INTO Votante (ci, credencial, nombre, apellido, fecha_nacimiento) VALUES (?, ?, ?, ?, ?)",
    [ci, credencial, nombre, apellido, fecha_nacimiento]
  );
  res.status(201).json({ message: "Votante creado" });
};

// PUT
exports.update = async (req, res) => {
  const { nombre, apellido, fecha_nacimiento } = req.body;
  await pool.query(
    "UPDATE Votante SET nombre = ?, apellido = ?, fecha_nacimiento = ? WHERE ci = ?",
    [nombre, apellido, fecha_nacimiento, req.params.ci]
  );
  res.json({ message: "Votante actualizado" });
};

// DELETE
exports.remove = async (req, res) => {
  await pool.query("DELETE FROM Votante WHERE ci = ?", [req.params.ci]);
  res.json({ message: "Votante eliminado" });
};

// Obtener circuito y elección asignados a un votante
exports.getAsignacion = async (req, res) => {
  const { credencial } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT idEleccion, idCircuito 
       FROM ListaVotacion_Circuito_Eleccion 
       WHERE credencial = ? 
       LIMIT 1`, [credencial]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró circuito para esta credencial' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener asignación de circuito/elección' });
  }
};

//Estado del voto de un votante
exports.getEstado = async (req, res) => {
  const { credencial, idEleccion, idCircuito } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT fueEmitido, esObservado 
       FROM Votante_Circuito_Eleccion 
       WHERE credencial = ? AND idEleccion = ? AND idCircuito = ?`,
      [credencial, idEleccion, idCircuito]
    );

    if (rows.length === 0) return res.status(404).json({ message: 'No hay información de voto' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al consultar estado del votante' });
  }
};
