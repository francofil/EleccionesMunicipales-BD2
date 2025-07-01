import { useEffect, useState } from 'react';
import {
  obtenerEstadoCircuito,
  cambiarEstadoCircuito,
  obtenerVotantesHabilitados,
  //agregarVotanteHabilitado,
  verificarVotanteHabilitado
} from '../../services/eleccionCircuitoService';

export default function EstadoCircuitoPage({ idEleccion, idCircuito }) {
  const [estado, setEstado] = useState(null);
  const [votantes, setVotantes] = useState([]);
  const [credencial, setCredencial] = useState('');
  const [verificacion, setVerificacion] = useState(null);

  useEffect(() => {
    obtenerEstadoCircuito(idEleccion, idCircuito).then(data => setEstado(data.estado));
    obtenerVotantesHabilitados(idEleccion, idCircuito).then(setVotantes);
  }, [idEleccion, idCircuito]);

  const toggleEstado = async () => {
    const nuevoEstado = estado === 'abierto' ? 'cerrado' : 'abierto';
    await cambiarEstadoCircuito(idEleccion, idCircuito, nuevoEstado);
    setEstado(nuevoEstado);
  };

  const handleVerificar = async () => {
    try {
      const res = await verificarVotanteHabilitado(idEleccion, idCircuito, credencial);
      setVerificacion(res);
    } catch (e) {
      setVerificacion({ error: e.message });
    }
  };

  return (
    <div>
      <h2>Estado del circuito: {estado}</h2>
      <button onClick={toggleEstado}>
        {estado === 'abierto' ? 'Cerrar mesa' : 'Abrir mesa'}
      </button>

      <h3>Votantes habilitados</h3>
      <ul>
        {votantes.map(v => (
          <li key={v.credencial}>{v.credencial}</li>
        ))}
      </ul>

      <h3>Verificar credencial</h3>
      <input value={credencial} onChange={e => setCredencial(e.target.value)} />
      <button onClick={handleVerificar}>Verificar</button>
      {verificacion && (
        <p>
          {verificacion.habilitado
            ? '✅ Está habilitado'
            : verificacion.error
              ? `❌ Error: ${verificacion.error}`
              : '❌ No está habilitado'}
        </p>
      )}
    </div>
  );
}
