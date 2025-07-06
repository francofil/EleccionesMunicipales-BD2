import { useEffect, useState } from 'react';
import { obtenerListasPorEleccion } from '../services/listaService';

export function useListas(idEleccion) {
  const [listas, setListas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerListasPorEleccion(idEleccion)
      .then(setListas)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [idEleccion]);

  return { listas, setListas, loading, error };
}
