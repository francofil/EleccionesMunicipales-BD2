// src/hooks/useVotantesPresidente.jsx
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { obtenerCircuitoDelPresidente } from '../services/presidenteService';
import { obtenerVotantesHabilitados } from '../services/eleccionCircuitoService';
import { obtenerVotantePorCredencial } from '../services/votantesService';

export function useVotantesPresidente() {
  const [votantes, setVotantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No logueado');

        const { ci, rol } = jwtDecode(token);
        if (rol !== 'presidente') throw new Error('Acceso no autorizado');

        // ✅ Obtener circuito asignado al presidente
        const circuito = await obtenerCircuitoDelPresidente(ci);
        const idEleccion = circuito.idEleccion;
        const idCircuito = circuito.idCircuito;

        // ✅ Traer credenciales habilitadas para ese circuito+elección
        const habilitados = await obtenerVotantesHabilitados(idEleccion, idCircuito);

        // ✅ Traer datos completos de cada votante
        const detalles = await Promise.all(
          habilitados.map(v => obtenerVotantePorCredencial(v.credencial))
        );

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
