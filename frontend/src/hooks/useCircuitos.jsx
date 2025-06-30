import { useEffect, useState } from 'react';
import { fetchCircuitos } from '../services/circuitoService';

export function useCircuitos() {
  const [circuitos, setCircuitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCircuitos();
        setCircuitos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { circuitos, loading, error };
}
