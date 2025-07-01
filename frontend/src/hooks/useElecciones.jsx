import { useEffect, useState } from 'react';
import { fetchElecciones } from '../services/eleccionService';

export function useElecciones() {
  const [elecciones, setElecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchElecciones();
        setElecciones(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { elecciones, loading, error };
}