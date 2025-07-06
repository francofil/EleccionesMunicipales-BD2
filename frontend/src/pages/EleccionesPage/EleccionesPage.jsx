import { useState } from 'react';
import { useElecciones } from '../../hooks/useElecciones';
import EleccionForm from '../../components/EleccionForm/EleccionForm';
import EleccionesList from '../../components/EleccionesList/EleccionesList';
import { deleteEleccion } from '../../services/eleccionService';
import './EleccionesPage.css';

export default function EleccionesPage() {
  const { elecciones, setElecciones, loading, error } = useElecciones();
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

  const handleSaved = (eleccionGuardada) => {
    setElecciones(prev => {
      const existe = prev.some(e => e.id === eleccionGuardada.id);
      return existe
        ? prev.map(e => e.id === eleccionGuardada.id ? eleccionGuardada : e)
        : [...prev, eleccionGuardada];
    });
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de que querés eliminar esta elección?");
    if (!confirmar) return;

    try {
      await deleteEleccion(id);
      setElecciones(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      alert("Error al eliminar: " + error.message);
    }
  };

  if (loading) return <p>Cargando…</p>;
  if (error) return <p style={{color:'red'}}>⚠ {error}</p>;

  return (
    <div className='elecciones-container'>
      <button className="boton" onClick={abrirFormularioNuevo}>➕ Agregar Elección</button>

      {mostrarFormulario && (
        <EleccionForm
          onClose={() => setMostrarFormulario(false)}
          eleccion={eleccionEditando}
          onSaved={handleSaved}
        />
      )}

      <EleccionesList
        elecciones={elecciones}
        onEdit={abrirFormularioEdicion}
        onDelete={handleDelete}
      />
    </div>
  );
}
