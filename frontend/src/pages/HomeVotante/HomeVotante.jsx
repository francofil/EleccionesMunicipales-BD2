import { useState, useEffect } from 'react';
import './HomeVotante.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useNavigate, useLocation  } from 'react-router-dom';
import { obtenerVotanteDeStorage, eliminarVotanteDeStorage } from '../../utils/loginVotanteUtils';

export default function HomeVotante() {
  const [active, setActive] = useState('bienvenida');
  const [votanteData, setVotanteData] = useState(null);
  const [estadoVoto, setEstadoVoto] = useState(null);
  const [estadoMesa, setEstadoMesa] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
        const asignacion = await resAsignacion.json();
        if (!resAsignacion.ok || !asignacion.idEleccion || !asignacion.idCircuito) {
          console.warn('Asignación no encontrada o incompleta:', asignacion);
          setEstadoVoto({ fueEmitido: false, esObservado: false });
          setEstadoMesa(null);
          setLoading(false);
          return;
        }
        const { idEleccion, idCircuito } = asignacion;

        // 2. Estado del voto
        let voto = { fueEmitido: false, esObservado: false }; // valor por defecto
        try {
          const resVoto = await fetch(`http://localhost:3000/votantes/estado/${credencial}/${idEleccion}/${idCircuito}`);
          if (resVoto.ok) {
            voto = await resVoto.json();
            console.log('Estado del voto:', voto);
          } else if (resVoto.status === 404) {
            console.warn('No hay estado del voto: se asume no emitido.');
          } else {
            throw new Error('Error inesperado al consultar estado del voto');
          }
        } catch (err) {
          console.error('Error consultando estado del voto:', err);
        }
        setEstadoVoto(voto);

        
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
  }, [location, navigate]);

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
      
          <button onClick={handleLogout} className="logout-button estilizado">Cerrar sesión</button>
        </div>

        <h2 className="titulo-principal">{titles[active]}</h2>

        {active === 'bienvenida' && (
          <div>
            <p><strong>Nombre:</strong> {votanteData?.nombre} {votanteData?.apellido}</p>
            <p><strong>Credencial:</strong> {votanteData?.credencial}</p>
            <p><strong>Estado del voto:</strong> {estadoVoto?.fueEmitido ? 'Emitido' : 'Pendiente'}</p>
            <p><strong>Tipo de voto:</strong> {estadoVoto?.esObservado ? 'Observado' : 'Regular'}</p>

            {estadoVoto?.fueEmitido && (
              <div className="constancia-texto mensaje-confirmacion">
                ✅ Se confirma que ha emitido su voto en esta elección.  
                La constancia ha sido registrada correctamente.
              </div>
            )}
          </div>
        )}

        {active === 'votar' && (
          estadoVoto?.fueEmitido ? (
            <p>Ya has emitido tu voto.</p>
          ) : estadoMesa?.mesaCerrada ? (
            <p>La mesa ya fue cerrada, no es posible emitir el voto.</p>
          ) : (
            <div className="boton-voto-wrapper">
            <button onClick={() => navigate('/votacion')}className="emitir-voto-button">Emitir mi voto</button>
            </div>
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
