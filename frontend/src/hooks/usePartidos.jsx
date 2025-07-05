import { useEffect, useState } from 'react';
import { obtenerPartidos } from '../services/partidoService';

export function usePartidos() {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerPartidos()
      .then(setPartidos)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { partidos, setPartidos, loading, error };
}
