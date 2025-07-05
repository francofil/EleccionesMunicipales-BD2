import { usePapeletas } from '../../hooks/usePapeletas';
import PapeletasList from '../../components/PapeletasList/PapeletasList';
import Buscador from '../../components/Buscador/Buscador';
import { useState } from 'react';

export default function PapeletasPage() {
  const { papeletas, loading, error } = usePapeletas();
  const [filtro, setFiltro] = useState('');

  const papeletasFiltradas = papeletas.filter(p =>
    p.color.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) return <p>Cargando…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="papeletas-container">
      <Buscador
        placeholder="Buscar por color..."
        onBuscar={setFiltro}
      />
      <PapeletasList papeletas={papeletasFiltradas} />
    </div>
  );
}
