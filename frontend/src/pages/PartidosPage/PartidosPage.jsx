import { usePartidos } from '../../hooks/usePartidos';
import PartidosList from '../../components/PartidosList/PartidosList';
import Buscador from '../../components/Buscador/Buscador';
import { useState } from 'react';

export default function PartidosPage() {
  const { partidos, loading, error } = usePartidos();
  const [filtro, setFiltro] = useState('');

  const partidosFiltrados = partidos.filter(p =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) return <p>Cargando…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="partidos-container">
      <Buscador
        placeholder="Buscar por nombre del partido..."
        onBuscar={setFiltro}
      />
      <PartidosList partidos={partidosFiltrados} />
    </div>
  );
}
