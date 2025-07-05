const pool = require('../db/db');

//Emite si el voto, no guarda que voto
exports.emitirConstanciaVoto = async (req, res) => {
    const { credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito } = req.body;
    try {
        if (!credencial || !fecha || !hora || typeof esObservado !== 'boolean' || typeof fueEmitido !== 'boolean' || !idEleccion || !idCircuito) {
            return res.status(400).json({ error: 'Faltan datos obligatorios o hay datos mal formateados' });
        }
        //Verifico si ya voto
        const [yaVoto] = await pool.query(
            `SELECT * FROM Votante_Circuito_Eleccion 
             WHERE credencial = ? AND idEleccion = ?`,
            [credencial, idEleccion]
        );

        if (yaVoto.length > 0) {
            return res.status(409).json({ error: 'El votante ya emitió su voto en esta elección' });
        }

        const [habilitado] = await pool.query(
            `SELECT * FROM ListaVotacion_Circuito_Eleccion 
             WHERE idEleccion = ? AND idCircuito = ? AND credencial = ?`,
            [idEleccion, idCircuito, credencial]
        )

        //SI es = a 0 es true sino es false
        const esObservado = habilitado.length === 0;

        const [rows] = await pool.query(
            'INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito]
        );

        res.status(201).json({
            message: esObservado
                ? 'Voto registrado como observado'
                : 'Voto emitido correctamente',
            observacion: esObservado,
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Guardar que se voto, no quien
exports.guardarVotoSecreto = async (req, res) => {
    const { credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito } = req.body;
    try {
        if (!credencial || !fecha || !hora || typeof esObservado !== 'boolean' || typeof fueEmitido !== 'boolean' || !idEleccion || !idCircuito) {
            return res.status(400).json({ error: 'Faltan datos obligatorios o hay datos mal formateados' });
        }
        //Verifico si ya voto
        const [yaVoto] = await pool.query(
            `SELECT * FROM Votante_Circuito_Eleccion 
             WHERE credencial = ? AND idEleccion = ?`,
            [credencial, idEleccion]
        );

        if (yaVoto.length > 0) {
            return res.status(409).json({ error: 'El votante ya emitió su voto en esta elección' });
        }

        const [habilitado] = await pool.query(
            `SELECT * FROM ListaVotacion_Circuito_Eleccion 
             WHERE idEleccion = ? AND idCircuito = ? AND credencial = ?`,
            [idEleccion, idCircuito, credencial]
        )

        //SI es = a 0 es true sino es false
        const esObservado = habilitado.length === 0;

        const [rows] = await pool.query(
            'INSERT INTO Votante_Circuito_Eleccion (credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [credencial, fecha, hora, esObservado, fueEmitido, idEleccion, idCircuito]
        );

        res.status(201).json({
            message: esObservado
                ? 'Voto registrado como observado'
                : 'Voto emitido correctamente',
            observacion: esObservado,
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.cerrarMesa = async (req, res) => {
  const { idEleccion, idCircuito } = req.params;

  try {
    // 1. Verificamos si ya está cerrada
    const [estado] = await db.query(
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
    await db.query(
      'UPDATE Eleccion_Circuito SET mesaCerrada = true WHERE idEleccion = ? AND idCircuito = ?',
      [idEleccion, idCircuito]
    );

    // 3. Devolver resultados
    const [resultados] = await db.query(`
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


