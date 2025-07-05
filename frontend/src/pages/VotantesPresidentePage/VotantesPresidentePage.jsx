import { useState } from 'react';
import { useVotantesPresidente } from '../../hooks/useVotantesPresidente';
import VotantesList from '../../components/VotantesList/VotantesList';
import Buscador from '../../components/Buscador/Buscador';

export default function VotantesPresidentePage() {
  const { votantes, loading, error } = useVotantesPresidente();
  const [filtro, setFiltro] = useState('');

  const votantesFiltrados = votantes.filter(v =>
    v.credencial.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) return <p>Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="votantes-container">
      <h1>Votantes del Circuito #1 </h1>

      <Buscador
        placeholder="Buscar por credencial..."
        onBuscar={setFiltro}
      />

      <VotantesList votantes={votantesFiltrados} />
    </div>
  );
}
