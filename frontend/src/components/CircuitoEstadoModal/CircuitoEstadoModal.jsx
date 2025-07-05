import { useEffect, useState } from 'react';
import {
  obtenerCircuitoEleccion,
  cambiarEstadoMesa,
  obtenerVotantesHabilitados,
  verificarVotanteHabilitado
} from '../../services/eleccionCircuitoService';
import './CircuitoEstadoModal.css';
import { Link } from 'react-router-dom';

export default function CircuitoEstadoModal({ idEleccion, circuito, onClose }) {
  const [estado,      setEstado]      = useState(null);      // 'abierto'|'cerrado'
  const [habilitados, setHabilitados] = useState([]);
  const [credencial,  setCredencial]  = useState('');
  const [verif,       setVerif]       = useState(null);
  const [msg,         setMsg]         = useState({ type: '', text: '' }); // loading|error|success

  /* ── carga inicial ── */
  useEffect(() => {
    (async () => {
      try {
        setMsg({ type: 'loading', text: 'Cargando…' });
        const est  = await obtenerCircuitoEleccion(idEleccion, circuito.id);
        const list = await obtenerVotantesHabilitados(idEleccion, circuito.id);
        setEstado(est.mesaCerrada ? 'cerrado' : 'abierto');
        setHabilitados(list);
        setMsg({ type: '', text: '' });
      } catch (e) {
        setMsg({ type: 'error', text: e.message });
      }
    })();
  }, [idEleccion, circuito.id]);

  /* ── abrir / cerrar mesa ── */
  const toggleEstado = async () => {
    try {
      setMsg({ type: 'loading', text: 'Actualizando…' });
      const nuevo = estado === 'abierto' ? 'cerrado' : 'abierto';
      await cambiarEstadoMesa(idEleccion, circuito.id, {
        mesaCerrada: nuevo === 'cerrado'
      });
      setEstado(nuevo);
      setMsg({ type: 'success', text: `Mesa ${nuevo}` });
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    }
  };

  /* ── verificar credencial ── */
  const handleVerificar = async () => {
    setVerif(null);
    try {
      const r = await verificarVotanteHabilitado(idEleccion, circuito.id, credencial);
      setVerif({ ok: true, habilitado: r.habilitado });
    } catch (e) {
      setVerif({ ok: false, message: e.message });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close" onClick={onClose}>✖</button>

        <h2>Mesa / Circuito {circuito.zona}</h2>

        {msg.type === 'loading' && <p className="loading">{msg.text}</p>}
        {msg.type === 'error'   && <p className="error">{msg.text}</p>}
        {msg.type === 'success' && <p className="success">{msg.text}</p>}

        {estado && (
          <>
            <p><strong>Estado:</strong> {estado}</p>
            <button onClick={toggleEstado}>
              {estado === 'abierto' ? 'Cerrar mesa' : 'Abrir mesa'}
            </button>

            <p><strong>Habilitados:</strong> {habilitados.length}</p>

            {/* Verificación rápida */}
            <div className="verif-box">
              <input
                value={credencial}
                onChange={e => setCredencial(e.target.value)}
                placeholder="Credencial"
              />
              <button onClick={handleVerificar}>Verificar</button>
            </div>

            {verif && (
              <p className={verif.ok && verif.habilitado ? 'success' : 'error'}>
                {verif.ok
                  ? verif.habilitado
                    ? '✅ Habilitado'
                    : '❌ No habilitado'
                  : `❌ ${verif.message}`}
              </p>
            )}

            <Link
              to={`/circuitos/${circuito.id}/estado`}
              state={{ idEleccion }}
              onClick={onClose}
            >
              Ver detalle completo →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
