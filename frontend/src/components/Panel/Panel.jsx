import CircuitosList from '../CircuitosList/CircuitosList';
import EleccionesList from '../CircuitosList/CircuitosList';
import './Panel.css';

export default function Panel({  title, active }) {
    const renderSection = () => {
    switch (active) {
      case 'circuitos':
        return <CircuitosList />;

      case 'elecciones':
        return <EleccionesList />;

      /* case 'listas':
           return <ListasList />;  // y así sucesivamente
      */

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
