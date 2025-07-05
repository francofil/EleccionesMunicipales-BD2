import CircuitosPage from '../../pages/CircuitosPage/CircuitosPage';
import EleccionesPage from '../../pages/EleccionesPage/EleccionesPage';
import VotantesPage from '../../pages/VotantesPage/VotantesPage';
import EstadoCircuitoPage from '../../pages/EstadoCircuitoPage/EstadoCircuitoPage';
import './Panel.css';
import PapeletasPage from '../../pages/PapeletasPage/PapeletasPage';
import PartidosPage from '../../pages/PartidosPage/PartidosPage';
import ResultadosPage from '../../pages/ResultadosPage/ResultadosPage';
export default function Panel({ title, active }) {
  const renderSection = () => {
    switch (active) {
      case 'circuitos':
        return <CircuitosPage />;

      case 'elecciones':
        return <EleccionesPage />;

      case 'votantes':
        return <VotantesPage />;

      case 'papeletas':
        return <PapeletasPage />;

      case 'partidos':
        return <PartidosPage />;

      case 'resultados':
        return <ResultadosPage />;
      default:
        // Si es "bienvenida" (o no existe la sección aún) mostramos sólo el título
        return null;
    }
  };
  return (
    <main className="panel">
      <div className="top-bar">
        <span className="icon">⚙️</span>
        <span className="icon">🔔</span>
        <span className="icon">👤</span>
      </div>

      <div className="content-wrapper">
        {title && (
          <div className="welcome">
            <h2>{title}</h2>
          </div>
        )}
        {renderSection()}
      </div>
    </main>
  );
}
