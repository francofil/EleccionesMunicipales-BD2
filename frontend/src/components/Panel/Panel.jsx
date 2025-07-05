import CircuitosPage from '../../pages/CircuitosPage/CircuitosPage';
import EleccionesPage from '../../pages/EleccionesPage/EleccionesPage';
import VotantesAdminPage from '../../pages/VotantesAdminPage/VotantesAdminPage';
import EstadoCircuitoPage from '../../pages/EstadoCircuitoPage/EstadoCircuitoPage';
import './Panel.css';
import PapeletasPage from '../../pages/PapeletasPage/PapeletasPage';
import PartidosPage from '../../pages/PartidosPage/PartidosPage';
import ResultadosPage from '../../pages/ResultadosPage/ResultadosPage';
import VotantesPresidentePage from '../../pages/VotantesPresidentePage/VotantesPresidentePage';
import CircuitoPresidentePage from '../../pages/CircuitoPresidentePage/CircuitoPresidentePage';
export default function Panel({ title, active, idCircuito,idEleccion }) {
  const renderSection = () => {
    switch (active) {
      case 'circuitos':
        return <CircuitosPage />;

      case 'elecciones':
        return <EleccionesPage />;

      case 'votantes':
        return <VotantesAdminPage />;

      case 'papeletas':
        return <PapeletasPage />;

      case 'partidos':
        return <PartidosPage />;

      case 'resultados':
        return <ResultadosPage />;
      
      case 'ver-votantes':
        return <VotantesPresidentePage  idCircuito={idCircuito}
                 idEleccion={idEleccion}/>
      case 'circuito':
        return <CircuitoPresidentePage/>
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
