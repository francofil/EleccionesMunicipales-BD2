import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { obtenerCircuitoDelPresidente } from '../services/presidenteService';

export function useCircuitoPresidente() {
  const [circuito, setCircuito] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setError('No logueado'); setLoading(false); return; }

    const { ci, rol } = jwtDecode(token);
    if (rol !== 'presidente') { setError('Acceso no autorizado'); setLoading(false); return; }

    (async () => {
      try {
        
        const circuitoCompleto = await obtenerCircuitoDelPresidente(ci);
        setCircuito({
          id:         circuitoCompleto.idCircuito,
          zona:       circuitoCompleto.zona,
          direccion:  circuitoCompleto.direccion,
          tipo:       circuitoCompleto.tipo,
          accesible:  !!circuitoCompleto.accesible,
          idMesa:     circuitoCompleto.idMesa,
          idEleccion: circuitoCompleto.idEleccion,
          idEstablecimiento: circuitoCompleto.idEstablecimiento,
          idDepartamento: circuitoCompleto.idDepartamento
        });
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { circuito, loading, error };
}
