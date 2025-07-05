import { useState } from 'react';
import CircuitosList        from '../../components/CircuitosList/CircuitosList';
import CircuitoForm         from '../../components/CircuitoForm/CircuitoForm';
import CircuitoEstadoModal  from '../../components/CircuitoEstadoModal/CircuitoEstadoModal';
import './CircuitosPage.css'
import { useCircuitos } from '../../hooks/useCircuitos';
import {
  deleteCircuito,
  fetchVotantesByCircuito
} from '../../services/circuitoService';

export default function CircuitosPage() {
  /* ───── estado global ───── */
  const { circuitos, setCircuitos, loading, error } = useCircuitos();

  /* ───── estados locales ───── */
  const [showForm,  setShowForm]  = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [votantes,  setVotantes]  = useState([]);
  const [modalCircuito, setModalCircuito] = useState(null);

  const idEleccionActual = 1; // TODO: obtén esto dinámicamente

  /* abrir formulario */
  const openNew  = ()  => { setEditing(null); setShowForm(true); };
  const openEdit = (c) => { setEditing(c);    setShowForm(true); };

  /* guardar */
  const handleSaved = (circuitoGuardado) => {
    setCircuitos(prev => {
      const existe = prev.some(c => c.id === circuitoGuardado.id);
      return existe
        ? prev.map(c => c.id === circuitoGuardado.id ? circuitoGuardado : c)
        : [...prev, circuitoGuardado];
    });
  };

  /* eliminar */
  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este circuito?')) return;
    try {
      await deleteCircuito(id);
      setCircuitos(prev => prev.filter(c => c.id !== id));
      if (editing?.id === id) { setShowForm(false); setEditing(null); }
    } catch (err) {
      console.error(err);
    }
  };

  /* votantes */
  const handleShowVotantes = async (id) => {
    try {
      const data = await fetchVotantesByCircuito(id);
      setVotantes(data);
    } catch (err) {
      console.error(err);
    }
  };

  /* abrir modal estado */
  const handleEstado = (circuito) => setModalCircuito(circuito);

  /* render */
  if (loading) return <p>Cargando…</p>;
  if (error)   return <p style={{ color: 'red' }}>⚠ {error}</p>;

  return (
    <>
      <button className="boton"  onClick={openNew}>➕ Agregar Circuito</button>

      {/* botón ⚙ Estado llega vía onEstado */}
      <CircuitosList
        circuitos={circuitos}
        onEdit={openEdit}
        onDelete={handleDelete}
        onShowVotantes={handleShowVotantes}
        onEstado={handleEstado}
      />

      {showForm && (
        <CircuitoForm
          circuito={editing}
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
        />
      )}

      {modalCircuito && (
        <CircuitoEstadoModal
          idEleccion={idEleccionActual}
          circuito={modalCircuito}
          onClose={() => setModalCircuito(null)}
        />
      )}

      {votantes.length > 0 && (
        <section className="votantes">
          <h3>Votantes del circuito</h3>
          <ul>
            {votantes.map(v => (
              <li key={v.credencial}>
                {v.nombre} {v.apellido} — {v.credencial}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
