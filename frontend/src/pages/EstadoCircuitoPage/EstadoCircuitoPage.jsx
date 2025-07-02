import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  obtenerCircuitoEleccion,
  cambiarEstadoMesa,
  obtenerVotantesHabilitados,
  verificarVotanteHabilitado,
  agregarVotanteHabilitado
} from '../../services/eleccionCircuitoService';

/* Página completa – ideal para operaciones extensas */
export default function EstadoCircuitoPage() {
  const { id } = useParams();                // idCircuito
  const { state } = useLocation();           // { idEleccion }
  const idEleccion = state?.idEleccion || 1; // fallback

  const [estado, setEstado]         = useState(null);
  const [habilitados, setHabilitados] = useState([]);
  const [credencial, setCredencial] = useState('');
  const [verif, setVerif]           = useState(null);
  const [msg, setMsg]               = useState({ type:'', text:'' });

  useEffect(() => {
    (async () => {
      try {
        setMsg({ type:'loading', text:'Cargando…' });
        const est = await obtenerCircuitoEleccion(idEleccion, id);
        const list= await obtenerVotantesHabilitados(idEleccion, id);
        setEstado(est.mesaCerrada ? 'cerrado' : 'abierto');
        setHabilitados(list);
        setMsg({ type:'', text:'' });
      } catch (e) {
        setMsg({ type:'error', text:e.message });
      }
    })();
  }, [idEleccion, id]);

  const toggleEstado = async () => {
    try {
      const nuevo = estado === 'abierto' ? 'cerrado' : 'abierto';
      await cambiarEstadoMesa(idEleccion, id, { mesaCerrada: nuevo === 'cerrado' });
      setEstado(nuevo);
    } catch (e) { setMsg({ type:'error', text:e.message }); }
  };

  const handleVerificar = async () => {
    setVerif(null);
    try {
      const r = await verificarVotanteHabilitado(idEleccion, id, credencial);
      setVerif({ ok:true, habilitado:r.habilitado });
    } catch (e) {
      setVerif({ ok:false, message:e.message });
    }
  };

  const handleAgregar = async () => {
    try {
      await agregarVotanteHabilitado({ idEleccion, idCircuito:id, credencial });
      const nueva = await obtenerVotantesHabilitados(idEleccion, id);
      setHabilitados(nueva);
      setMsg({ type:'success', text:'Votante agregado' });
    } catch (e) {
      setMsg({ type:'error', text:e.message });
    }
  };

  return (
    <div style={{ padding:'1rem' }}>
      <h1>Circuito #{id} – Elección {idEleccion}</h1>

      {msg.type && <p className={msg.type}>{msg.text}</p>}

      {estado && (
        <>
          <p><strong>Estado:</strong> {estado}</p>
          <button onClick={toggleEstado}>
            {estado === 'abierto' ? 'Cerrar mesa' : 'Abrir mesa'}
          </button>
        </>
      )}

      <h2>Votantes habilitados ({habilitados.length})</h2>
      <ul>
        {habilitados.map(v => (
          <li key={v.credencial}>{v.credencial}</li>
        ))}
      </ul>

      <h3>Verificar / agregar credencial</h3>
      <input
        value={credencial}
        onChange={e => setCredencial(e.target.value)}
        placeholder="Credencial"
      />
      <button onClick={handleVerificar}>Verificar</button>
      <button onClick={handleAgregar}>Agregar</button>

      {verif && (
        <p className={verif.ok && verif.habilitado ? 'success' : 'error'}>
          {verif.ok
            ? verif.habilitado
              ? '✅ Ya habilitado'
              : '❌ No habilitado aún'
            : `❌ ${verif.message}`}
        </p>
      )}
    </div>
  );
}
