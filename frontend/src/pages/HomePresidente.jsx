import './HomePresidente.css';
//import { useNavigate } from 'react-router-dom';

export default function Home() {
  const mesaId = 3515; // Podés cambiarlo según el usuario logueado
  
  //const navigate = useNavigate();

  return (
    <div className="home-container">
      <aside className="sidebar">
        <img src="/escudo-uruguay.png" alt="Logo" className="logo-sidebar" />
        <h3>Corte Electoral</h3>
        <p className="subtitle">Presidente de Mesa</p>
        <nav className="menu">
          <button>Lista Votantes</button>
          <button>Resultados</button>
        </nav>
        <div className="mesa-actions">
          <button className="btn-abrir">Abrir Mesa</button>
          <button className="btn-cerrar">Cerrar Mesa</button>
        </div>
        <footer>Desarrollado por Soft Elecciones</footer>
      </aside>

      <main className="main-panel">
        <div className="top-bar">
          <span className="icon">⚙️</span>
          <span className="icon">🔔</span>
          <span className="icon">👤</span>
        </div>
        <div className="welcome">
          <h2>Bienvenido al administrador de la comisión receptora de votos</h2>
          <h3>Mesa Nº {mesaId}</h3>
        </div>
      </main>
    </div>
  );
}
