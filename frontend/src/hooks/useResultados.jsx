import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';  // corregí import
import { obtenerCircuitoDelPresidente } from '../services/presidenteService';
import { 
  obtenerResultadosPorCircuito, 
  obtenerListaMasVotada, 
  obtenerVotosPorPartido 
} from '../services/resultadosService';

export function useResultados(trigger = 0) {
  const [resultados, setResultados] = useState([]);
  const [listaMasVotada, setListaMasVotada] = useState(null);
  const [votosPorPartido, setVotosPorPartido] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [circuito, setCircuito] = useState(null);
  const [estadoMesa, setEstadoMesa] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No logueado');

        const { ci, rol } = jwtDecode(token);
        if (rol !== 'presidente') throw new Error('Acceso no autorizado');

        const datosCircuito = await obtenerCircuitoDelPresidente(ci);
        const idEleccion = datosCircuito.idEleccion;
        const idCircuito = datosCircuito.idCircuito;
        setCircuito({ idEleccion, idCircuito, ...datosCircuito });

        const resEstado = await fetch(`http://localhost:3000/eleccionCircuito/estado/${idEleccion}/${idCircuito}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resEstado.ok) throw new Error('No se pudo obtener el estado de la mesa');
        const estado = await resEstado.json();
        setEstadoMesa(estado);

        if (estado.mesaCerrada) {
          // Acá llamamos los 3 endpoints en paralelo para optimizar tiempo
          const [datosResultados, datosListaMasVotada, datosVotosPorPartido] = await Promise.all([
            obtenerResultadosPorCircuito(idEleccion, idCircuito),
            obtenerListaMasVotada(idEleccion, idCircuito),
            obtenerVotosPorPartido(idEleccion, idCircuito)
          ]);

          setResultados(datosResultados.resultados || []);
          setListaMasVotada(datosListaMasVotada || null);
          setVotosPorPartido(datosVotosPorPartido.resultados || []);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [trigger]);

  return { resultados, listaMasVotada, votosPorPartido, loading, error, circuito, estadoMesa };
}
