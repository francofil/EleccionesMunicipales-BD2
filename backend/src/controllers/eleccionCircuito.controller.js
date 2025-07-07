const pool = require("../db/db");

// 🔍 Obtener el registro de un circuito asignado a una elección
exports.obtenerCircuitoDeEleccion = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Circuito_Eleccion WHERE idEleccion = ? AND idCircuito = ?",
      [req.params.idEleccion, req.params.idCircuito]
    );
    rows.length
      ? res.json(rows[0])
      : res.status(404).json({ error: "No se encontró ese circuito en la elección" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ➕ Añadir votante habilitado a un circuito en una elección
exports.añadirVotante = async (req, res) => {
  const { credencial, idEleccion, idCircuito } = req.body;
  try {
    await pool.query(
      "INSERT INTO ListaVotacion_Circuito_Eleccion (idEleccion, idCircuito, credencial) VALUES (?, ?, ?)",
      [idEleccion, idCircuito, credencial]
    );
    res.status(201).json({ message: "Votante habilitado agregado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔄 Cambiar el estado (cerrar o abrir mesa) de un circuito de una elección
exports.cambiarEstadoMesa = async (req, res) => {
  const { mesaCerrada } = req.body;
  try {
    await pool.query(
      "UPDATE Circuito_Eleccion SET mesaCerrada = ? WHERE idEleccion = ? AND idCircuito = ?",
      [mesaCerrada, req.params.idEleccion, req.params.idCircuito]
    );
    res.json({ message: "Estado de mesa actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📋 Obtener todas las credenciales habilitadas en un circuito de una elección
exports.getAllVotantesHabilitados = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT credencial FROM ListaVotacion_Circuito_Eleccion WHERE idEleccion = ? AND idCircuito = ?",
      [req.params.idEleccion, req.params.idCircuito]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔍 Verificar si una credencial está habilitada en un circuito y elección
exports.getOneVotanteHabilitado = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT credencial FROM ListaVotacion_Circuito_Eleccion WHERE idEleccion = ? AND idCircuito = ? AND credencial = ?",
      [req.params.idEleccion, req.params.idCircuito, req.params.credencial]
    );
    rows.length > 0
      ? res.json({ habilitado: true })
      : res.status(404).json({ habilitado: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Traer estado de un circuito de una Eleccion, si la mesa esta cerrada, cant habilitados, votos observados, emitidos, restantes, totales.
exports.getEstado = async (req, res) => {
  const { idEleccion, idCircuito } = req.body;

  try {
    const [[{ totalHabilitados }]] = await pool.query(
      "SELECT COUNT(*) AS totalHabilitados FROM ListaVotacion_Circuito_Eleccion WHERE idEleccion = ? AND idCircuito = ?",
      [idEleccion, idCircuito]
    );

    const [votos] = await pool.query(
      "SELECT fueEmitido, esObservado FROM Votante_Circuito_Eleccion WHERE idEleccion = ? AND idCircuito = ?",
      [idEleccion, idCircuito]
    );

    const totalEmitidos = votos.filter(v => v.fueEmitido).length;
    const observados = votos.filter(v => v.fueEmitido && v.esObservado).length;

    const [[estadoMesa]] = await pool.query(
      "SELECT mesaCerrada FROM Circuito_Eleccion WHERE idEleccion = ? AND idCircuito = ?",
      [idEleccion, idCircuito]
    );

    res.status(200).json({
      circuito: idCircuito,
      eleccion: idEleccion,
      habilitados: totalHabilitados,
      emitidos: totalEmitidos,
      restante: totalHabilitados - totalEmitidos,
      observados: observados,
      estado: estadoMesa.mesaCerrada
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// Estado básico público de una mesa (para votante)
exports.getEstadoMesaPublico = async (req, res) => {
  const { idEleccion, idCircuito } = req.params;

  try {
    // Cantidad de votantes habilitados
    const [[{ totalHabilitados }]] = await pool.query(
      `SELECT COUNT(*) AS totalHabilitados
       FROM ListaVotacion_Circuito_Eleccion
       WHERE idEleccion = ? AND idCircuito = ?`,
      [idEleccion, idCircuito]
    );

    // Votos emitidos (totales y observados)
    const [votos] = await pool.query(
      `SELECT fueEmitido FROM Votante_Circuito_Eleccion
       WHERE idEleccion = ? AND idCircuito = ?`,
      [idEleccion, idCircuito]
    );
    const emitidos = votos.filter(v => v.fueEmitido).length;

    // Estado de la mesa
    const [[{ mesaCerrada }]] = await pool.query(
      `SELECT mesaCerrada FROM Circuito_Eleccion
       WHERE idEleccion = ? AND idCircuito = ?`,
      [idEleccion, idCircuito]
    );

    res.status(200).json({
      mesaCerrada,
      habilitados: totalHabilitados,
      emitidos
    });

  } catch (error) {
    console.error('Error al consultar estado público de mesa:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


//POST, creamos la relacion circuito - eleccion
exports.vincularCircuitoAEleccion = async (req, res) => {
  const { idEleccion, idCircuito, idMesa, ciAgente } = req.body;

  if (!idEleccion || !idCircuito || !idMesa || !ciAgente) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    await pool.query(
      `INSERT INTO Circuito_Eleccion 
       (idCircuito, idEleccion, idMesa, ciAgente, mesaCerrada) 
       VALUES (?, ?, ?, ?, FALSE)`,
      [idCircuito, idEleccion, idMesa, ciAgente]
    );

    res.status(201).json({ message: "Circuito vinculado a elección exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener el circuito y elección asignados a un presidente por su CI
exports.getCircuitoDelPresidente = async (req, res) => {
  const ciPresidente = req.params.ci;

  try {
    const [rows] = await pool.query(
      `SELECT 
          ec.idEleccion, 
          ec.idCircuito, 
          ec.mesaCerrada,
          c.zona, 
          c.tipo, 
          c.accesible, 
          c.direccion, 
          c.idEstablecimiento, 
          c.idDepartamento
       FROM Circuito_Eleccion ec
       JOIN Circuito c ON ec.idCircuito = c.id
       JOIN Mesa m ON ec.idMesa = m.id
       JOIN Mesa_Integrante mi ON mi.idMesa = m.id
       JOIN IntegranteMesa im ON mi.ciIntegrante = im.ci
       WHERE im.ci = ? AND im.rol = 'Presidente'`,
      [ciPresidente]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró circuito asignado al presidente' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error en obtenerCircuitoPorPresidente:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.cerrarMesa = async (req, res) => {
  const { idEleccion, idCircuito } = req.params;

  try {
    // 1. Verificamos si ya está cerrada
    const [estado] = await pool.query(
      'SELECT mesaCerrada FROM Eleccion_Circuito WHERE idEleccion = ? AND idCircuito = ?',
      [idEleccion, idCircuito]
    );

    if (!estado.length) {
      return res.status(404).json({ error: 'Circuito o elección no encontrada' });
    }

    if (estado[0].mesaCerrada) {
      return res.status(400).json({ error: 'La mesa ya está cerrada' });
    }

    // 2. Se cierra la mesa
    await pool.query(
      'UPDATE Eleccion_Circuito SET mesaCerrada = true WHERE idEleccion = ? AND idCircuito = ?',
      [idEleccion, idCircuito]
    );

    // 3. Devolver resultados
    const [resultados] = await pool.query(`
      SELECT l.nombreLista, 
             COUNT(v.idVoto) as votos,
             SUM(v.votoObservado) as votosObservados
      FROM Voto v
      JOIN Lista l ON v.idLista = l.idLista
      WHERE v.idEleccion = ? AND v.idCircuito = ?
      GROUP BY l.nombreLista
    `, [idEleccion, idCircuito]);

    res.status(200).json(resultados);
  } catch (err) {
    console.error("Error al cerrar mesa:", err);
    res.status(500).json({ error: 'Error interno al cerrar la mesa' });
  }
};