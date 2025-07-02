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
  const [estado, setEstado] = useState(null);      // 'abierto' | 'cerrado'
  const [habilitados, setHabilitados] = useState([]);
  const [credencial, setCredencial] = useState('');
  const [verif, setVerif] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' }); // loading | error | success

  // ───── CARGA INICIAL ─────
  useEffect(() => {
    (async () => {
      try {
        setMsg({ type: 'loading', text: 'Cargando…' });
        const est = await obtenerCircuitoEleccion(idEleccion, circuito.id);
        const list = await obtenerVotantesHabilitados(idEleccion, circuito.id);
        setEstado(est.mesaCerrada ? 'cerrado' : 'abierto');
        setHabilitados(list);
        setMsg({ type: '', text: '' });
      } catch (e) {
        setMsg({ type: 'error', text: e.message });
      }
    })();
  }, [idEleccion, circuito.id]);

  // ───── CAMBIAR ESTADO MESA ─────
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

  // ───── VERIFICAR VOTANTE ─────
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
      <div className="modal-card stylish">
        <button className="close-btn" onClick={onClose}>✖</button>

        <h2 className="modal-title">Circuito {circuito.zona}</h2>

        {msg.type && <p className={`msg ${msg.type}`}>{msg.text}</p>}

        {estado && (
          <>
            <div className="estado-info">
              <p><strong>Estado:</strong> <span className={`estado-tag ${estado}`}>{estado}</span></p>
              <button className="estado-btn" onClick={toggleEstado}>
                {estado === 'abierto' ? 'Cerrar mesa' : 'Abrir mesa'}
              </button>
            </div>

            <p className="habilitados-count">
              <strong>Habilitados:</strong> {habilitados.length}
            </p>

            {/* VERIFICACIÓN RÁPIDA */}
            <div className="verif-box">
              <input
                className="input-credencial"
                value={credencial}
                onChange={e => setCredencial(e.target.value)}
                placeholder="Credencial"
              />
              <button className="verif-btn" onClick={handleVerificar}>Verificar</button>
            </div>

            {verif && (
              <p className={`verif-msg ${verif.ok && verif.habilitado ? 'success' : 'error'}`}>
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
              className="link-detalle"
            >
              Ver detalle completo →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
