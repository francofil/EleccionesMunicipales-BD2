import { useEffect, useState } from 'react';
import { obtenerVotantesPorCircuito } from '../services/votantesService';

export function useVotantesPorCircuito(idCircuito) {
  const [votantes, setVotantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idCircuito) {
         console.warn("No se recibió idCircuito");
    return;
    }

    console.log("Consultando votantes del circuito:", idCircuito);

    const fetchVotantes = async () => {
      try {
        const data = await obtenerVotantesPorCircuito(idCircuito);
        setVotantes(data);
      } catch (err) {
        console.error("Error al obtener votantes del circuito:", err);
        setError('Error al obtener votantes del circuito.');
      } finally {
        setLoading(false);
      }
    };

    fetchVotantes();
  }, [idCircuito]);

  return { votantes, loading, error };
}
