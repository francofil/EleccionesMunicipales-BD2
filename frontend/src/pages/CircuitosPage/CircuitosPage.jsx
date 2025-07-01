// src/pages/CircuitosPage.jsx
import { useState } from 'react';
import CircuitosList   from '../../components/CircuitosList/CircuitosList';
import CircuitoForm    from '../../components/CircuitoForm/CircuitoForm';

import { useCircuitos } from '../../hooks/useCircuitos';
import {
  deleteCircuito,
  fetchVotantesByCircuito
} from '../../services/circuitoService';

export default function CircuitosPage() {
  /* ───── estado global vía hook ───── */
  const { circuitos, setCircuitos, loading, error } = useCircuitos();

  /* ───── estados locales ───── */
  const [showForm,  setShowForm]  = useState(false);
  const [editing,   setEditing]   = useState(null); // null = nuevo
  const [votantes,  setVotantes]  = useState([]);

  /* ───── abrir formulario ───── */
  const openNew  = ()        => { setEditing(null);   setShowForm(true); };
  const openEdit = (c)       => { setEditing(c);      setShowForm(true); };

  /* ───── guardar (callback del formulario) ───── */
  const handleSaved = (circuitoGuardado) => {
    setCircuitos(prev => {
      const existe = prev.some(c => c.id === circuitoGuardado.id);
      return existe
        ? prev.map(c => c.id === circuitoGuardado.id ? circuitoGuardado : c)
        : [...prev, circuitoGuardado];
    });
  };

  /* ───── eliminar ───── */
  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este circuito?')) return;
    try {
      await deleteCircuito(id);
      setCircuitos(prev => prev.filter(c => c.id !== id));
      // cierra el form si estaba editando ese circuito
      if (editing?.id === id) { setShowForm(false); setEditing(null); }
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  /* ───── cargar votantes ───── */
  const handleShowVotantes = async (id) => {
    try {
      const data = await fetchVotantesByCircuito(id);
      setVotantes(data);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  /* ───── render ───── */
  if (loading) return <p>Cargando…</p>;
  if (error)   return <p style={{ color: 'red' }}>⚠ {error}</p>;

  return (
    <>
      <button onClick={openNew}>➕ Agregar Circuito</button>

      <CircuitosList
        circuitos={circuitos}
        onEdit={openEdit}
        onDelete={handleDelete}
        onShowVotantes={handleShowVotantes}
      />

      {showForm && (
        <CircuitoForm
          circuito={editing}
          onClose={() => setShowForm(false)}
          onSaved={handleSaved}
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
