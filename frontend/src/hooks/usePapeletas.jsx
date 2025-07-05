import { useEffect, useState } from 'react';
import { obtenerPapeletas } from '../services/papeletaService';

export function usePapeletas() {
  const [papeletas, setPapeletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerPapeletas()
      .then(setPapeletas)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { papeletas, setPapeletas, loading, error };
}
