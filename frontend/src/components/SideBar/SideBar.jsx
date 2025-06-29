import './Sidebar.css';

export default function SidebarAdmin({ setActive }) {
  return (
    <aside className="sidebar">
      <img src="/escudo-uruguay.png" alt="Logo" className="logo-sidebar" />
      <h3>Corte Electoral</h3>
      <p className="subtitle">Administrador</p>

      <nav className="menu">
        <button onClick={() => setActive('circuitos')}>Circuitos</button>
        <button onClick={() => setActive('elecciones')}>Elecciones</button>
        <button onClick={() => setActive('listas')}>Listas</button>
        <button onClick={() => setActive('partidos')}>Partidos</button>
        <button onClick={() => setActive('establecimientos')}>Establecimientos</button>
        <button onClick={() => setActive('resultados')}>Resultados</button>
      </nav>
       </aside>
  );
}
