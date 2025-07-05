import './Sidebar.css';

export default function Sidebar({ setActive, rol }) {
  const renderMenu = () => {
    switch (rol) {
      case 'administrador':
        return (
          <>
            <button onClick={() => setActive('circuitos')}>Circuitos</button>
            <button onClick={() => setActive('elecciones')}>Elecciones</button>
            <button onClick={() => setActive('papeletas')}>Papeletas</button>
            <button onClick={() => setActive('partidos')}>Partidos</button>
            <button onClick={() => setActive('votantes')}>Votantes</button>
            <button onClick={() => setActive('resultados')}>Resultados</button>
          </>
        );
      case 'presidente':
        return (
          <>
            <button onClick={() => setActive('votantes')}>Ver Votantes</button>
            <button onClick={() => setActive('circuito')}>Circuito</button>
            <button onClick={() => setActive('resultados')}>Resultados</button>
          </>
        );
      case 'votante':
        return (
          <>
            <button onClick={() => setActive('votar')}>Emitir Voto</button>
            <button onClick={() => setActive('estado')}>Consultar Estado</button>
          </>
        );
      default:
        return <p>Rol no reconocido</p>;
    }
  };

  return (
    <aside className="sidebar">
      <img src="/escudo-uruguay.png" alt="Logo" className="logo-sidebar" />
      <h3>Corte Electoral</h3>
      <p className="subtitle">{rol.charAt(0).toUpperCase() + rol.slice(1)}</p>

      <nav className="menu">
        {renderMenu()}
      </nav>
    </aside>
  );
}
