import { useEffect, useState } from 'react';
import { fetchCircuitos } from '../services/circuitoService';

/**
 * Hook que obtiene la lista de circuitos desde el backend y
 * ofrece el setter para poder actualizarla sin recargar la página.
 */
export function useCircuitos() {
  const [circuitos, setCircuitos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    (async () => {
      try {
        const data = await fetchCircuitos();
        if (!cancelado) setCircuitos(data);
      } catch (err) {
        if (!cancelado) setError(err.message);
      } finally {
        if (!cancelado) setLoading(false);
      }
    })();

    return () => { cancelado = true; };
  }, []);

  return { circuitos, setCircuitos, loading, error };
}
