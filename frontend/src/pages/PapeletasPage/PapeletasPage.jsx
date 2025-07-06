import { useState } from 'react';
import { usePapeletas } from '../../hooks/usePapeletas';
import PapeletasList from '../../components/PapeletasList/PapeletasList';
import PapeletaForm from '../../components/PapeletaForm/PapeletaForm';
import { crearPapeleta } from '../../services/papeletaService';
import './PapeletasPage.css';

export default function PapeletasPage() {
  const { papeletas, loading, error } = usePapeletas();
  const [showForm, setShowForm] = useState(false);

  const handleSaved = async (nuevaPapeleta) => {
    try {
      await crearPapeleta(nuevaPapeleta);
      setShowForm(false);     
    } catch (err) {
      console.error(err);
      alert('Error al crear papeleta');
    }
  };

  if (loading) return <p>Cargando…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="papeletas-container">
     

      <button className="boton" onClick={() => setShowForm(true)} >
        ➕ Agregar Papeleta
      </button>

      {showForm && (
        <PapeletaForm
          onSaved={handleSaved}
          onClose={() => setShowForm(false)}
        />
      )}

      <PapeletasList papeletas={papeletas} />
    </div>
  );
}
