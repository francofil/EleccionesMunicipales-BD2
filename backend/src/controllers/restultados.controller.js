const pool = require("../db/db");

// Obtener la lista más votada en una elección (y circuito opcional)
exports.getListaMasVotada = async (req, res) => {
  const { idEleccion, idCircuito } = req.query;

  try {
    // 1. Total de votos válidos (sin blancos ni anulados)
    const [totalResult] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM Voto
       WHERE idEleccion = ?
       ${idCircuito ? 'AND idCircuito = ?' : ''}
       AND fueEnBlanco = FALSE AND fueAnulado = FALSE`,
      idCircuito ? [idEleccion, idCircuito] : [idEleccion]
    );
    const totalVotos = totalResult[0]?.total || 0;

    if (totalVotos === 0) {
      return res.status(200).json({ message: "No hay votos válidos registrados", total: 0 });
    }

    // 2. Lista más votada
    const [result] = await pool.query(
      `SELECT l.id AS idLista, p.nombre AS partido, COUNT(v.id) AS cantidad
       FROM Voto v
       JOIN Papeleta pa ON v.idPapeleta = pa.id
       JOIN Lista l ON pa.id = l.id
       JOIN Partido p ON pa.idPartido = p.id
       WHERE v.idEleccion = ?
       ${idCircuito ? 'AND v.idCircuito = ?' : ''}
       AND v.fueEnBlanco = FALSE AND v.fueAnulado = FALSE
       GROUP BY l.id, p.nombre
       ORDER BY cantidad DESC
       LIMIT 1`,
      idCircuito ? [idEleccion, idCircuito] : [idEleccion]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "No se encontró lista más votada" });
    }

    const lista = result[0];
    const porcentaje = ((lista.cantidad / totalVotos) * 100).toFixed(2);

    res.json({
      idLista: lista.idLista,
      partido: lista.partido,
      cantidadVotos: lista.cantidad,
      porcentaje: `${porcentaje}%`,
      total: totalVotos
    });

  } catch (error) {
    console.error("Error al obtener la lista más votada:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.getVotosPorPartido = async (req, res) => {
  const { idEleccion, idCircuito } = req.query;

  try {
    const params = idCircuito ? [idEleccion, idCircuito] : [idEleccion];

    // Total de votos emitidos (incluye blancos y anulados)
    const [[{ totalVotos }]] = await pool.query(
      `SELECT COUNT(*) AS totalVotos
       FROM Voto
       WHERE idEleccion = ?
       ${idCircuito ? 'AND idCircuito = ?' : ''}`,
      params
    );

    if (totalVotos === 0) {
      return res.status(200).json({ message: "No hay votos registrados", total: 0 });
    }

    // Votos válidos agrupados por partido
    const [votosPorPartido] = await pool.query(
      `SELECT pa.idPartido, pt.nombre AS partido, COUNT(v.id) AS votos
       FROM Voto v
       JOIN Papeleta pa ON v.idPapeleta = pa.id
       JOIN Partido pt ON pa.idPartido = pt.id
       WHERE v.idEleccion = ?
       ${idCircuito ? 'AND v.idCircuito = ?' : ''}
       AND v.fueEnBlanco = FALSE AND v.fueAnulado = FALSE
       GROUP BY pa.idPartido, pt.nombre
       ORDER BY votos DESC`,
      params
    );

    // Votos en blanco
    const [[{ blancos }]] = await pool.query(
      `SELECT COUNT(*) AS blancos
       FROM Voto
       WHERE idEleccion = ?
       ${idCircuito ? 'AND idCircuito = ?' : ''}
       AND fueEnBlanco = TRUE`,
      params
    );

    // Votos anulados
    const [[{ anulados }]] = await pool.query(
      `SELECT COUNT(*) AS anulados
       FROM Voto
       WHERE idEleccion = ?
       ${idCircuito ? 'AND idCircuito = ?' : ''}
       AND fueAnulado = TRUE`,
      params
    );

    const resultados = votosPorPartido.map(p => ({
      partido: p.partido,
      votos: p.votos,
      porcentaje: ((p.votos / totalVotos) * 100).toFixed(2) + "%"
    }));

    resultados.push(
      { partido: "En Blanco", votos: blancos, porcentaje: ((blancos / totalVotos) * 100).toFixed(2) + "%" },
      { partido: "Anulados", votos: anulados, porcentaje: ((anulados / totalVotos) * 100).toFixed(2) + "%" }
    );

    res.json({
      total: totalVotos,
      resultados
    });

  } catch (error) {
    console.error("Error en getVotosPorPartido:", error);
    res.status(500).json({ error: "Error al calcular los votos por partido" });
  }
};

exports.getResultadosPorCircuito = async (req, res) => {
  const { idEleccion, idCircuito } = req.params;

  try {
    // 1. Total votos en ese circuito
    const [[{ totalVotos }]] = await pool.query(
      `SELECT COUNT(*) as totalVotos
       FROM Voto
       WHERE idEleccion = ? AND idCircuito = ?`,
      [idEleccion, idCircuito]
    );

    // 2. Obtener resultados con candidato, partido, votos
    const [resultados] = await pool.query(
      `SELECT 
        pa.idPartido,
        pa.id AS idPapeleta,
        COUNT(*) AS votos,
        par.nombre AS partido,
        v.nombre AS candidatoNombre,
        v.apellido AS candidatoApellido
      FROM Voto vto
      JOIN Papeleta pa ON vto.idPapeleta = pa.id
      JOIN Partido par ON pa.idPartido = par.id
      JOIN Candidato c ON c.idPartido = par.id
      JOIN Votante v ON v.ci = c.ci
      WHERE vto.idEleccion = ? AND vto.idCircuito = ?
      GROUP BY pa.idPartido, pa.id, par.nombre, v.nombre, v.apellido
      ORDER BY votos DESC`,
      [idEleccion, idCircuito]
    );

    // 3. Agregar porcentaje
    const formateado = resultados.map(r => ({
      partido: r.partido,
      candidato: `${r.candidatoNombre} ${r.candidatoApellido}`,
      votos: r.votos,
      porcentaje: ((r.votos / totalVotos) * 100).toFixed(2) + '%'
    }));

    res.json({ total: totalVotos, resultados: formateado });

  } catch (error) {
    console.error('Error al obtener resultados del circuito:', error);
    res.status(500).json({ error: 'Error al calcular resultados del circuito' });
  }
};
