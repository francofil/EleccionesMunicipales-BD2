import { useState } from 'react';
import { useVotantesPorCircuito } from '../../hooks/useVotantesPorCircuito';
import VotantesList from '../../components/VotantesList/VotantesList';
import Buscador from '../../components/Buscador/Buscador';

export default function VotantesPagePresidente({ circuito }) {
  const { votantes, loading, error } = useVotantesPorCircuito(circuito?.idCircuito);
  const [filtro, setFiltro] = useState('');

  const votantesFiltrados = votantes.filter(v =>
    v.credencial?.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) return <p>Cargando…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="circuitos-container">
      <Buscador placeholder="Buscar por credencial..." onBuscar={setFiltro} />
      <VotantesList votantes={votantesFiltrados} />
    </div>
  );
}
