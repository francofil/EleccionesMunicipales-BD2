import CircuitosPage from '../../pages/CircuitosPage/CircuitosPage';
import EleccionesPage from '../../pages/EleccionesPage/EleccionesPage';
import VotantesPage from '../../pages/VotantesPage/VotantesPage';
import EstadoCircuitoPage from '../../pages/EstadoCircuitoPage/EstadoCircuitoPage';
import './Panel.css';
import ResultadosPage from '../../pages/ResultadosPage/ResultadosPage';
import VotantesPagePresidente from '../../pages/VotantesPagePresidente/VotantesPagePresidente';

export default function Panel({ title, active, circuito, resultados, estadoMesa, rol }) {
    const renderSection = () => {
    switch (active) {
      case 'circuitos':
        return <CircuitosPage />;

      case 'elecciones':
        return <EleccionesPage />;
      
      case 'votantes':         
        if (rol === 'presidente') {
          return <VotantesPagePresidente circuito={circuito} />;
        } else {
          return <VotantesPage />;
        }
  
      /* case 'listas':
           return <ListasList />;  // y así sucesivamente
      */
      case 'resultados':
        return (
          <ResultadosPage
            resultados={resultados}
            circuito={circuito} 
            estadoMesa={estadoMesa}
          />
          
        );
        

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
