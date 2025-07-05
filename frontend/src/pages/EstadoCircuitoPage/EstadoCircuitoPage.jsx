import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  obtenerCircuitoEleccion,
  cambiarEstadoMesa,
  obtenerVotantesHabilitados,
  verificarVotanteHabilitado,
  agregarVotanteHabilitado
} from '../../services/eleccionCircuitoService';
import './EstadoCircuitoPage.css';
import { useNavigate } from 'react-router-dom';

export default function EstadoCircuitoPage() {
  const { id }     = useParams();          // idCircuito
  const { state }  = useLocation();        // { idEleccion }
  const idEleccion = state?.idEleccion ?? 1;
  const navigate = useNavigate();


  /* ─── estados ─── */
  const [estado,       setEstado]       = useState(null);   // abierto | cerrado
  const [habilitados,  setHabilitados]  = useState([]);
  const [credencial,   setCredencial]   = useState('');
  const [verif,        setVerif]        = useState(null);   // { ok, habilitado | message }
  const [msg,          setMsg]          = useState({ type:'', text:'' }); // loading | error | success

  /* ─── carga inicial ─── */
  useEffect(() => {
    (async () => {
      try {
        setMsg({ type:'loading', text:'Cargando…' });
        const est   = await obtenerCircuitoEleccion(idEleccion, id);
        const lista = await obtenerVotantesHabilitados(idEleccion, id);
        setEstado(est.mesaCerrada ? 'cerrado' : 'abierto');
        setHabilitados(lista);
        setMsg({ type:'', text:'' });
      } catch (e) {
        setMsg({ type:'error', text:e.message });
      }
    })();
  }, [idEleccion, id]);

  /* ─── abrir / cerrar mesa ─── */
  const toggleEstado = async () => {
    try {
      const nuevo = estado === 'abierto' ? 'cerrado' : 'abierto';
      await cambiarEstadoMesa(idEleccion, id, { mesaCerrada: nuevo === 'cerrado' });
      setEstado(nuevo);
    } catch (e) {
      setMsg({ type:'error', text:e.message });
    }
  };

  /* ─── verificar credencial ─── */
  const handleVerificar = async () => {
    setVerif(null);
    try {
      const r = await verificarVotanteHabilitado(idEleccion, id, credencial);
      setVerif({ ok:true, habilitado:r.habilitado });
    } catch (e) {
      setVerif({ ok:false, message:e.message });
    }
  };

  /* ─── agregar habilitado ─── */
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

  /* ─── render ─── */
  return (
    <div className="estado-circuito-container">
      <button className="boton volver" onClick={() => navigate(-1)}>⬅ Volver</button>

      <h1>Circuito #{id} – Elección {idEleccion}</h1>

      {msg.type && (
        <p className={
          msg.type === 'success' ? 'mensaje-exito'
          : msg.type === 'error' ? 'mensaje-error'
          : 'loading'
        }>
          {msg.text}
        </p>
      )}

      {estado && (
        <>
          <p>
            <strong>Estado:</strong>{' '}
            <span className={`estado-tag ${estado}`}>{estado}</span>
          </p>

          <button className="boton" onClick={toggleEstado}>
            {estado === 'abierto' ? 'Cerrar mesa' : 'Abrir mesa'}
          </button>
        </>
      )}

      <h2>Votantes habilitados ({habilitados.length})</h2>
      <ul className="lista-habilitados">
        {habilitados.map(v => (
          <li key={v.credencial}>{v.credencial}</li>
        ))}
      </ul>

      <h3>Verificar/agregar credencial</h3>
      <div className="verif-box">
        <input
          value={credencial}
          onChange={e => setCredencial(e.target.value)}
          placeholder="Credencial"
        />
        <button className="boton" onClick={handleVerificar}>Verificar</button>
        <button className="boton" onClick={handleAgregar}>Agregar</button>
      </div>

      {verif && (
        <p className={
          verif.ok && verif.habilitado ? 'mensaje-exito' : 'mensaje-error'
        }>
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
