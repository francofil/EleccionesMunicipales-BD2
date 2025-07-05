import { useEffect, useState } from 'react';
import { obtenerVotantes } from '../services/votantesService';

export function useVotantes() {
  const [votantes, setVotantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerVotantes()
      .then(setVotantes)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { votantes, setVotantes, loading, error };
}
