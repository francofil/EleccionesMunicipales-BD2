import { useState } from 'react';
import { useListas } from '../../hooks/useListas';
import ListaForm from '../../components/ListaForm/ListaForm';
import ListasList from '../../components/ListaList/ListaList'; 
import './ListaPage.css';

export default function ListaPage() {
  const idEleccion = 1; // aún hardcodeado
  const { listas, setListas, loading, error } = useListas(idEleccion);
  const [showForm, setShowForm] = useState(false);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="listas-container">
      <button className="boton" onClick={() => setShowForm(true)}>➕ Agregar Lista</button>

      {showForm && (
        <ListaForm onClose={() => setShowForm(false)} setListas={setListas} />
      )}

      <ListasList listas={listas} /> {/* ✅ ACÁ se usa el componente */}
    </div>
  );
}
