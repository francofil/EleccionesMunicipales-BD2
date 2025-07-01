import { useState } from 'react';
import { useElecciones } from '../../hooks/useElecciones';
import EleccionForm from '../../components/EleccionForm/EleccionForm';
import EleccionesList from '../../components/EleccionesList/EleccionesList';
import { deleteEleccion } from '../../services/eleccionService';

export default function EleccionesPage() {
  const { elecciones, loading, error } = useElecciones();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [eleccionEditando, setEleccionEditando] = useState(null);

  const abrirFormularioNuevo = () => {
    setEleccionEditando(null);
    setMostrarFormulario(true);
  };

  const abrirFormularioEdicion = (eleccion) => {
    setEleccionEditando(eleccion);
    setMostrarFormulario(true);
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que querés eliminar esta elección?");
    if (!confirmar) return;

    try {
      await deleteEleccion(id);
      alert("Elección eliminada correctamente");
      window.location.reload();
    } catch (error) {
      alert("Error al eliminar: " + error.message);
    }
  };

  if (loading) return <p>Cargando…</p>;
  if (error) return <p style={{color:'red'}}>⚠ {error}</p>;

  return (
    <>
      <button onClick={abrirFormularioNuevo}>➕ Agregar Elección</button>

      {mostrarFormulario && (
        <EleccionForm
          onClose={() => setMostrarFormulario(false)}
          eleccion={eleccionEditando}
        />
      )}

      <EleccionesList
        elecciones={elecciones}
        onEdit={abrirFormularioEdicion}
        onDelete={handleDelete}
      />
    </>
  );
}