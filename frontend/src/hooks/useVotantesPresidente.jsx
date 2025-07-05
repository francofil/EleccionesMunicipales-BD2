import { useEffect, useState } from 'react';
import { obtenerVotantesHabilitados } from '../services/eleccionCircuitoService';
import { obtenerVotantePorCredencial } from '../services/votantesService';

export function useVotantesPresidente() {
  const [votantes, setVotantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const idEleccion = 1;  // HARD CODEADO
        const idCircuito = 1;  // HARD CODEADO

        // Paso 1: Obtener las credenciales
        const habilitados = await obtenerVotantesHabilitados(idEleccion, idCircuito);
console.log(habilitados)
        // Paso 2: Obtener los datos completos de cada votante
        const detalles = await Promise.all(
          habilitados.map(v => obtenerVotantePorCredencial(v.credencial))
        );

        // ✅ Guardar los datos completos
        setVotantes(detalles);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { votantes, loading, error };
}
