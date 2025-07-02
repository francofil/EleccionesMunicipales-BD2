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
    [req.params.credencial]
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
