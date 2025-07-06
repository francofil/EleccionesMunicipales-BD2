import { useState, useEffect } from 'react';
import './HomeVotante.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { obtenerVotanteDeStorage, eliminarVotanteDeStorage } from '../../utils/loginVotanteUtils';

export default function HomeVotante() {
  const [active, setActive] = useState('bienvenida');
  const [votanteData, setVotanteData] = useState(null);
  const [estadoVoto, setEstadoVoto] = useState(null);
  const [estadoMesa, setEstadoMesa] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const titles = {
    bienvenida: 'Bienvenido al sistema de votación',
    votar: 'Emitir Voto',
    estado: 'Estado del Proceso Electoral',
  };

  useEffect(() => {
    const fetchDatos = async () => {
      const votante = obtenerVotanteDeStorage();

      if (!votante) {
        alert("Sesión no encontrada. Redirigiendo al login...");
        navigate("/loginVotante");
        return;
      }

      try {
        setVotanteData(votante);
        console.log('Datos del votante:', votante);
        const credencial = votante.credencial;

        // 1. Obtener asignación circuito-elección
        const resAsignacion = await fetch(`http://localhost:3000/votantes/asignacion/${credencial}`);
        if (!resAsignacion.ok) throw new Error('No se encontró asignación');
        const { idEleccion, idCircuito } = await resAsignacion.json();

        // 2. Estado del voto
        const resVoto = await fetch(`http://localhost:3000/votantes/estado/${credencial}/${idEleccion}/${idCircuito}`);
        if (!resVoto.ok) throw new Error('No se encontró el estado del voto');
        const voto = await resVoto.json();
        setEstadoVoto(voto);
        console.log('Estado del voto:', voto);

        // 3. Estado de la mesa
        const resMesa = await fetch(`http://localhost:3000/eleccionCircuito/estadoMesa/${idEleccion}/${idCircuito}`);
        if (!resMesa.ok) throw new Error('No se encontró el estado de la mesa');
        const mesa = await resMesa.json();
        setEstadoMesa(mesa);
      } catch (err) {
        console.error('Error cargando datos del votante:', err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [navigate]);

  const handleLogout = () => {
    eliminarVotanteDeStorage();
    navigate('/loginVotante');
  };

  if (loading) return <div>Cargando información...</div>;

  return (
    <div className="homevotante-container">
      <Sidebar setActive={setActive} rol="votante" />
      <div className="main-content">
        <div className="top-bar">
          <h2>{titles[active]}</h2>
          <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>
        </div>

        {active === 'bienvenida' && (
          <div>
            <p><strong>Nombre:</strong> {votanteData?.nombre} {votanteData?.apellido}</p>
            <p><strong>Credencial:</strong> {votanteData?.credencial}</p>
            <p><strong>Estado del voto:</strong> {estadoVoto?.fueEmitido ? 'Emitido' : 'Pendiente'}</p>
            <p><strong>Tipo de voto:</strong> {estadoVoto?.esObservado ? 'Observado' : 'Regular'}</p>

            {estadoVoto?.fueEmitido && (
              <a
                href={`http://localhost:3000/votacion/constancia/${votanteData?.credencial}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver constancia de voto
              </a>
            )}
          </div>
        )}

        {active === 'votar' && (
          estadoVoto?.fueEmitido ? (
            <p>Ya has emitido tu voto.</p>
          ) : estadoMesa?.mesaCerrada ? (
            <p>La mesa ya fue cerrada, no es posible emitir el voto.</p>
          ) : (
            <button onClick={() => navigate('/votacion')}>Emitir mi voto</button>
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
