import CircuitosPage from '../../pages/CircuitosPage/CircuitosPage';
import EleccionesPage from '../../pages/EleccionesPage/EleccionesPage';
import './Panel.css';

export default function Panel({  title, active }) {
    const renderSection = () => {
    switch (active) {
      case 'circuitos':
        return <CircuitosPage />;

      case 'elecciones':
        return <EleccionesPage />;

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
