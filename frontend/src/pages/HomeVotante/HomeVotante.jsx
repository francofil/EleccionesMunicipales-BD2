import Sidebar from '../../components/Sidebar/Sidebar';
import Panel from '../../components/Panel/Panel';
import { useState } from 'react';
import './HomeVotante.css';

export default function HomeVotante({ votante }) {
  const [active, setActive] = useState('bienvenida');

  const titles = {
    bienvenida: 'Bienvenido al sistema de votación',
    votar: 'Emitir Voto',
    estado: 'Estado del Proceso Electoral'
  };

  return (
    <div className="homevotante-container">
      <Sidebar setActive={setActive} rol="votante" />
      <div className="main-content">
        <Panel active={active} title={titles[active]} votante={votante} />
      </div>
    </div>
  );
}
