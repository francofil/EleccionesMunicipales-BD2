import { useVotantes } from '../../hooks/useVotantes';
import VotantesList from '../../components/VotantesList/VotantesList';

export default function VotantesPage() {
  const { votantes, loading, error } = useVotantes();
  if (loading) return <p>Cargando…</p>;
  if (error)   return <p style={{color:'red'}}>{error}</p>;

  return <VotantesList votantes={votantes} />;
}
