import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import { obtenerListasPorEleccion } from '../../services/listaService';
import './Votacion.css';
//import {jwtDecode} from 'jwt-decode';

export default function Votacion() {
  const [listas, setListas] = useState([]);
  const [seleccion, setSeleccion] = useState(null);
  const [esObservado, setEsObservado] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDatos = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      
      try {
        /*const tokenDecoded = jwtDecode(token);
        const credencial = tokenDecoded.credencial;*/

        const credencial = localStorage.getItem('credencial');
        if (!credencial) throw new Error('Credencial no encontrada');

        const resAsignacion = await fetch(`http://localhost:3000/votantes/asignacion/${credencial}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!resAsignacion.ok) throw new Error('No se encontró la asignación');

        const { idEleccion, idCircuito } = await resAsignacion.json();

        localStorage.setItem('idEleccion', idEleccion);
        localStorage.setItem('idCircuito', idCircuito);

        const listasData = await obtenerListasPorEleccion(idEleccion);
        const listasUnicas = listasData.filter((lista, index, self) =>
          index === self.findIndex((l) => l.idLista === lista.idLista)
        );
        console.log('Listas obtenidas:', listasUnicas);

        setListas(listasUnicas);
      } catch (err) {
        console.error('Error al obtener datos para la votación', err);
      } finally {
        setLoading(false);
      }
        /*const resListas = await fetch(`http://localhost:3000/listasDisponibles/${idEleccion}/${idCircuito}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dataListas = await resListas.json();
        setListas(dataListas);
      } catch (err) {
        console.error('Error al obtener datos para la votación', err);
      } finally {
        setLoading(false);
      }*/
    };

    fetchDatos();
  }, []);

  const emitirVoto = async () => {
    const token = localStorage.getItem('token');
    const credencial = localStorage.getItem('credencial');
    const idEleccion = localStorage.getItem('idEleccion');
    const idCircuito = localStorage.getItem('idCircuito');

    const fecha = new Date().toISOString().split('T')[0];
    const hora = new Date().toTimeString().split(' ')[0];

    try {
      await fetch('http://localhost:3000/votacion/emitir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          credencial, fecha, hora, esObservado, fueEmitido: true, idEleccion, idCircuito
        })
      });

      await fetch('http://localhost:3000/votacion/registrarVoto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          credencial,
          fecha,
          hora,
          idEleccion,
          idCircuito,
          idPapeleta: seleccion === 'blanco' ? null : seleccion,
          fueEnBlanco: seleccion === 'blanco',
          fueAnulado: false
        })
      });

      alert('Voto emitido correctamente');
      navigate('/homeVotante');
    } catch (err) {
      alert('Error al emitir el voto');
      console.error(err);
    }
  };

  if (loading) return <div className="votacion-container">Cargando opciones de voto...</div>;

  return (
    <div className="votacion-container">
      <Sidebar rol="votante" minimal={true} />
      <div className="votacion-main">
        <div className="votacion-panel">
          {listas.map(lista => (
            <div key={lista.idLista} className="opcion-lista">
              <input
                type="radio"
                id={`lista-${lista.idLista}`}
                name="opcion"
                value={lista.idLista}
                checked={seleccion === lista.idLista}
                onChange={() => setSeleccion(lista.idLista)}
              />
              <label htmlFor={`lista-${lista.idLista}`}>{lista.organo} - {lista.departamento}</label>
            </div>
          ))}
          <div className="opcion-lista">
            <input
              type="radio"
              id="blanco"
              name="opcion"
              value="blanco"
              checked={seleccion === 'blanco'}
              onChange={() => setSeleccion('blanco')}
            />
            <label htmlFor="blanco">Voto en blanco</label>
          </div>
          <div className="observado-checkbox">
            <input
              type="checkbox"
              id="observado"
              checked={esObservado}
              onChange={() => setEsObservado(!esObservado)}
            />
            <label htmlFor="observado">Marcar como observado</label>
          </div>
          <div className="btn-confirmar-container">
            <button
              onClick={emitirVoto}
              disabled={!seleccion}
              className="btn-confirmar"
            >
              Confirmar Voto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
