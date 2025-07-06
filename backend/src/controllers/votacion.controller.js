const pool = require("../db/db");

//Emite si el voto, no guarda que voto
exports.emitirConstanciaVoto = async (req, res) => {
  const { credencial, fecha, hora, fueEmitido, idEleccion, idCircuito } =
    req.body;

  try {
    if (
      !credencial ||
      !fecha ||
      !hora ||
      typeof fueEmitido !== "boolean" ||
      !idEleccion ||
      !idCircuito
    ) {
      return res
        .status(400)
        .json({
          error: "Faltan datos obligatorios o hay datos mal formateados",
        });
    }

    // Verificar si ya votó en esta elección
    const [yaVoto] = await pool.query(
      `SELECT 1 FROM Votante_Circuito_Eleccion WHERE credencial = ? AND idEleccion = ?`,
      [credencial, idEleccion]
    );
    if (yaVoto.length > 0) {
      return res
        .status(409)
        .json({ error: "El votante ya emitió su voto en esta elección" });
    }

    // Verificar si está habilitado para ese circuito
    const [habilitado] = await pool.query(
      `SELECT 1 FROM ListaVotacion_Circuito_Eleccion WHERE idEleccion = ? AND idCircuito = ? AND credencial = ?`,
      [idEleccion, idCircuito, credencial]
    );
    const esObservado = habilitado.length === 0;

    const [result] = await pool.query(
      `INSERT INTO Votante_Circuito_Eleccion 
       (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito]
    );

    res.status(201).json({
      message: esObservado
        ? "Voto registrado como observado"
        : "Voto emitido correctamente",
      observacion: esObservado,
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Guardar que se voto, no quien
exports.registrarVoto = async (req, res) => {
  const {
    credencial,
    idEleccion,
    idCircuito,
    idPapeleta,
    fueEnBlanco,
    fueAnulado,
    fecha,
    hora
  } = req.body;

  // Validaciones mínimas
  if (!credencial || !idEleccion || !idCircuito || !fecha || !hora) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    // Validar que el votante no haya votado ya en esta elección
    const [yaVoto] = await pool.query(
      `SELECT 1 FROM Votante_Circuito_Eleccion 
       WHERE credencial = ? AND idEleccion = ?`,
      [credencial, idEleccion]
    );

    if (yaVoto.length > 0) {
      return res.status(409).json({ error: 'El votante ya emitió su voto en esta elección' });
    }

    // Validar si el votante está habilitado para ese circuito
    const [habilitado] = await pool.query(
      `SELECT 1 FROM ListaVotacion_Circuito_Eleccion 
       WHERE idEleccion = ? AND idCircuito = ? AND credencial = ?`,
      [idEleccion, idCircuito, credencial]
    );

    const esObservado = habilitado.length === 0;

    // Si seleccionó una papeleta, validar que pertenezca a esa elección
    if (idPapeleta && !fueEnBlanco && !fueAnulado) {
      const [papeletaOk] = await pool.query(
        `SELECT 1 FROM Papeleta WHERE id = ? AND eleccion = ?`,
        [idPapeleta, idEleccion]
      );
      if (papeletaOk.length === 0) {
        return res.status(400).json({ error: 'La papeleta no corresponde a esta elección' });
      }
    }

    // Insertar en tabla Voto (contenido del voto)
    const [votoInsertado] = await pool.query(
      `INSERT INTO Voto (idEleccion, idCircuito, idPapeleta, fueEnBlanco, fueAnulado, fecha)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [idEleccion, idCircuito, idPapeleta || null, fueEnBlanco, fueAnulado, fecha]
    );

    // Insertar en tabla de trazabilidad (quién votó, cuándo, cómo)
    await pool.query(
      `INSERT INTO Votante_Circuito_Eleccion 
       (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [credencial, fecha, hora, esObservado, true, idEleccion, idCircuito]
    );

    res.status(201).json({
      message: esObservado
        ? 'Voto observado registrado con éxito'
        : 'Voto registrado con éxito',
      observacion: esObservado,
      votoId: votoInsertado.insertId
    });

  } catch (error) {
    console.error('Error al registrar el voto:', error);
    res.status(500).json({ error: 'Error interno al registrar el voto' });
  }
};





