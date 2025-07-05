import { useVotantes } from '../../hooks/useVotantes';
import VotantesList from '../../components/VotantesList/VotantesList';
import Buscador from '../../components/Buscador/Buscador';
import { useState } from 'react';

export default function VotantesPage() {
  const { votantes, loading, error } = useVotantes();
  const [filtro, setFiltro] = useState('');

  const votantesFiltrados = votantes.filter(v =>
    v.credencial.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) return <p>Cargando…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="votantes-container">
      <Buscador
        placeholder="Buscar por credencial..."
        onBuscar={setFiltro}
      />
      <VotantesList votantes={votantesFiltrados} />
    </div>
  );
}
