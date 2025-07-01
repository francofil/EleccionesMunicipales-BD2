import './HomeAdmin.css';
import PanelAdmin from '../../components/Panel/Panel';
import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
export default function HomeAdmin() {
  const [active, setActive] = useState('bienvenida');

  const titles = {
    bienvenida:      'Bienvenido al panel del administrador',
    circuitos:       'Gestión de Circuitos',
    elecciones:      'Gestión de Elecciones',
    listas:          'Gestión de Listas',
    partidos:        'Gestión de Partidos',
    establecimientos:'Gestión de Establecimientos',
    resultados:      'Resultados'
  };
  return (
    <div className="homeadmin-container">
      <Sidebar setActive={setActive} rol="administrador" />
      <div className="main-content">
        <PanelAdmin active={active} title={titles[active]} />
      </div>
    </div>
  );
}
