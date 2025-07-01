import Sidebar from'../../components/Sidebar/Sidebar';
import Panel from '../../components/Panel/Panel';
import { useState } from 'react';
import './HomePresidente.css';

export default function HomePresidente() {
  const [active, setActive] = useState('bienvenida');

  const titles = {
    bienvenida: 'Bienvenido Presidente de Mesa',
    circuito: 'Gestión del Circuito',
    resultados: 'Resultados'
  };

  return (
    <div className="homeadmin-container">
      <Sidebar setActive={setActive} rol="presidente" />
      <div className="main-content">
        <Panel active={active} title={titles[active]} />
      </div>
    </div>
  );
}
