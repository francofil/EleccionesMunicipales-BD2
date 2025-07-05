import Sidebar from'../../components/Sidebar/Sidebar';
import Panel from '../../components/Panel/Panel';
import { useState, useEffect } from 'react';
import './HomePresidente.css';
import { jwtDecode } from 'jwt-decode';

export default function HomePresidente() {
  const [active, setActive] = useState('bienvenida');
  const [votantes, setVotantes] = useState([]);
  const [circuito, setCircuito] = useState(null);
  const [resultados, setResultados] = useState(null);
  const [estadoMesa, setEstadoMesa] = useState(null);
  const [loading, setLoading] = useState(true);

  const titles = {
    bienvenida: 'Bienvenido Presidente de Mesa',
    circuito: 'Gestión del Circuito',
    resultados: 'Resultados',
    verVotantes: 'Votantes del Circuito'
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decoded = jwtDecode(token);
      const ci = decoded.ci;

      try {
        // Obtener el circuito del presidente por su CI
        const resCircuito = await fetch(`http://localhost:3000/eleccion-circuito/porPresidente/${ci}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });


        if (!resCircuito.ok) throw new Error('No se pudo obtener el circuito del presidente');
        const circuitoData = await resCircuito.json();
        console.log("CIRCUITO OBTENIDO EN HOME:", circuitoData); 
        setCircuito(circuitoData);

        const { idCircuito, idEleccion } = circuitoData;
        if (!idCircuito || !idEleccion) throw new Error('Datos del circuito inválidos');

        // Estado de la mesa
        const resMesa = await fetch(`http://localhost:3000/votacion/estadoMesa/${idEleccion}/${idCircuito}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resMesa.ok) throw new Error('No se pudo obtener el estado de la mesa');
        const estado = await resMesa.json();
        setEstadoMesa(estado);

        // Votantes del circuito
        const resVotantes = await fetch(`http://localhost:3000/circuitos/${idCircuito}/votantes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resVotantes.ok) throw new Error('No se pudo obtener la lista de votantes');
        const votantesData = await resVotantes.json();
        setVotantes(votantesData);

        // Resultados (solo si mesa cerrada)
        if (estado.mesaCerrada) {
          const resResultados = await fetch(`http://localhost:3000/resultados/${idEleccion}/${idCircuito}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (resResultados.ok) {
            const data = await resResultados.json();
            setResultados(data);
          }
        }
      } catch (err) {
        console.error("Error al cargar datos del presidente:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Cargando información...</div>;

  return (
    <div className="homeadmin-container">
      <Sidebar setActive={setActive} rol="presidente" />
      <div className="main-content">
        <Panel
        active={active}
        title={titles[active]}
        circuito={circuito} 
        votantes={votantes}
        resultados={resultados}
        estadoMesa={estadoMesa}
        rol="presidente"
      />
      </div>
    </div>
  );
}

