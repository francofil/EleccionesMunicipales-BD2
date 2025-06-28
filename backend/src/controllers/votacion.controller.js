const pool = require('../db/db');

exports.emitirVoto = async (req, res) => {
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

exports.cantEmitidosPorCircuito = async (req, res) => {
    try {
        const [cantVotantesDelCircuito] = await pool.query('SELECT count(*) FROM  ListaVotacion_Circuito_Eleccion WHERE idEleccion = ? AND idCircuito = ? ', [req.body.idEleccion, req.body.idCircuito]);
        const [votantesDelCircuito] = await pool.query('SELECT credencial FROM  ListaVotacion_Circuito_Eleccion WHERE idEleccion = ? AND idCircuito = ? ', [req.body.idEleccion, req.body.idCircuito]);
        const votosEmitidosCIrcuito = 0;
        votantesDelCircuito.forEach(element => {
            const [emitido] = pool.query('SELECT fueEmitido FROM Votante_Circuito_Eleccion WHERE credencial = ? AND idEleccion = ? AND idCircuito = ?', [element.credencial, req.body.idEleccion, req.body.idCircuito]);
            if (emitido.fueEmitido == true) {
                votantesDelCircuito = votantesDelCircuito + 1;
            }
        });
        res.status(200).json({
            circuito: idCircuito,
            eleccion: idEleccion,
            habilitados: totalHabilitados,
            emitidos: totalEmitidos,
            restante: totalHabilitados - totalEmitidos
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};




