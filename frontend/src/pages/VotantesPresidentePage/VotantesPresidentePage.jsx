// src/pages/VotantesPresidentePage/VotantesPresidentePage.jsx
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

  if (loading) return <p>Cargando votantes...</p>;
  if (error) return <p style={{ color: 'red' }}>⚠ {error}</p>;

  return (
    <div className="votantes-container">
      <h1>Votantes de mi circuito</h1>

      <Buscador
        placeholder="Buscar por credencial..."
        onBuscar={setFiltro}
      />

      <VotantesList votantes={votantesFiltrados} />
    </div>
  );
}
