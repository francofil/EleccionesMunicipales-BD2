import Sidebar from '../../components/Sidebar/Sidebar';
import Panel from '../../components/Panel/Panel';
import { useState , useEffect } from 'react';
import './HomeVotante.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


export default function HomeVotante() {
  const [active, setActive] = useState('bienvenida');
  const [votanteData, setVotanteData] = useState(null);
  const [estadoVoto, setEstadoVoto] = useState(null); // { fueEmitido: true/false, esObservado: true/false }
  const [estadoMesa, setEstadoMesa] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  const titles = {
    bienvenida: 'Bienvenido al sistema de votación',
    votar: 'Emitir Voto',
    estado: 'Estado del Proceso Electoral'
  };


  useEffect(() => {
  const fetchDatos = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded = jwtDecode(token);
    const ci = decoded.ci;

    try {
      // 1. Obtener datos del votante por cédula
      const resVotante = await fetch(`http://localhost:3000/votantes/${ci}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await resVotante.json();
      setVotanteData(data);

      const credencial = data.credencial;

      // 2. Obtener asignación real de circuito y elección
      const resAsignacion = await fetch(`http://localhost:3000/votacion/asignacion/${credencial}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const { idEleccion, idCircuito } = await resAsignacion.json();

      // 3. Estado de voto
      const resVoto = await fetch(`http://localhost:3000/votacion/estado/${credencial}/${idEleccion}/${idCircuito}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const voto = await resVoto.json();
      setEstadoVoto(voto);

      // 4. Estado general de la mesa
      const resMesa = await fetch(`http://localhost:3000/votacion/estadoMesa/${idEleccion}/${idCircuito}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const mesa = await resMesa.json();
      setEstadoMesa(mesa);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchDatos();
}, []);

  if (loading) return <div>Cargando información...</div>;
  //if (!votanteData) return <div>No se encontró información del votante.</div>;
  

  return (
    <div className="homevotante-container">
      <Sidebar setActive={setActive} rol="votante" />
      <div className="main-content">
        <h2>{titles[active]}</h2>

        {active === 'bienvenida' && (
          <div>
            <p><strong>Nombre:</strong> {votanteData?.nombre} {votanteData?.apellido}</p>
            <p><strong>Credencial:</strong> {votanteData?.credencial}</p>
            <p><strong>Estado del voto:</strong> {estadoVoto?.fueEmitido ? 'Emitido' : 'Pendiente'}</p>
            <p><strong>Tipo de voto:</strong> {estadoVoto?.esObservado ? 'Observado' : 'Regular'}</p>
          </div>
        )}

        {active === 'votar' && (
          estadoVoto?.fueEmitido ? (
            <p>Ya has emitido tu voto.</p>
          ) : (
            <button onClick={() => navigate('/votacion')}>
              Emitir mi voto
            </button>
          )
        )}

        {active === 'estado' && estadoMesa && (
          <div>
            <p><strong>Mesa cerrada:</strong> {estadoMesa.mesaCerrada ? 'Sí' : 'No'}</p>
            <p><strong>Habilitados para votar:</strong> {estadoMesa.habilitados}</p>
            <p><strong>Votos emitidos:</strong> {estadoMesa.emitidos}</p>
          </div>
        )}
      </div>
    </div>
  );
}
