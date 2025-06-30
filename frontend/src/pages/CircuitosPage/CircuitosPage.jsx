import { useState } from 'react';
import CircuitosList from '../../components/CircuitosList/CircuitosList';
import { useCircuitos } from '../../hooks/useCircuitos';
import CircuitoForm from '../../components/CircuitoForm/CircuitoForm'; // (lo vamos a crear ahora)
import { deleteCircuito } from '../../services/circuitoService';

export default function CircuitosPage() {
  const { circuitos, loading, error } = useCircuitos();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [circuitoEditando, setCircuitoEditando] = useState(null);
  const abrirFormularioNuevo = () => {
    setCircuitoEditando(null);
    setMostrarFormulario(true);
  };

  const abrirFormularioEdicion = (circuito) => {
    setCircuitoEditando(circuito);
    setMostrarFormulario(true);
  };
const handleDelete = async (id) => {
  const confirmar = window.confirm("¿Estás segura de que querés eliminar este circuito?");
  if (!confirmar) return;

  try {
    await deleteCircuito(id);
    alert("Circuito eliminado correctamente");
    window.location.reload(); // luego podemos actualizar la lista sin recargar
  } catch (error) {
    alert("Error al eliminar: " + error.message);
  }
};

  if (loading) return <p>Cargando…</p>;
  if (error)   return <p style={{color:'red'}}>⚠ {error}</p>;

   return (
    <>
      <button onClick={abrirFormularioNuevo}>➕ Agregar Circuito</button>

      {mostrarFormulario && (
        <CircuitoForm
          onClose={() => setMostrarFormulario(false)}
          circuito={circuitoEditando}
        />
      )}

      <CircuitosList
        circuitos={circuitos}
        onEdit={abrirFormularioEdicion}
          onDelete={handleDelete}
      />
    </>
  );
}