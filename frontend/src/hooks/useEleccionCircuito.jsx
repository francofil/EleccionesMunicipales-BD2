import { useEffect, useState } from 'react';
import { getEstado, getHabilitados } from '../services/eleccionCircuitoService';

export function useEleccionCircuito(idEleccion, idCircuito) {
  const [estado, setEstado] = useState(null);
  const [habilitados, setHabilitados] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const e = await getEstado(idEleccion, idCircuito);
        const h = await getHabilitados(idEleccion, idCircuito);
        setEstado(e.mesaCerrada ? 'cerrado' : 'abierto');
        setHabilitados(h);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [idEleccion, idCircuito]);

  return { estado, setEstado, habilitados, setHabilitados, loading, error };
}
