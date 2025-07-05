import './ResultadosPage.css';
import { useState, useEffect} from 'react';

export default function ResultadosPage({ resultados, circuito, estadoMesa }) {
  const [cerrando, setCerrando] = useState(false);
  const [cerrada, setCerrada] = useState(estadoMesa?.mesaCerrada || false);
  const [datos, setDatos] = useState(resultados || []);
  const token = localStorage.getItem('token');

   useEffect(() => {
    if (estadoMesa?.mesaCerrada) setCerrada(true);
    if (resultados) setDatos(resultados);
  }, [estadoMesa, resultados]);

  const cerrarMesa = async () => {
    if (!circuito?.idEleccion || !circuito?.idCircuito) {
      alert("Los datos del circuito aún no están disponibles.");
      return;
    }

  setCerrando(true);
  try {
    const res = await fetch(`http://localhost:3000/votacion/cerrarMesa/${circuito.idEleccion}/${circuito.idCircuito}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) throw new Error('No se pudo cerrar la mesa');

    const nuevosResultados = await res.json();
        setDatos(nuevosResultados);
        setCerrada(true);
        } catch (error) {
        alert('Error al cerrar la mesa: ' + error.message);
        } finally {
        setCerrando(false);
        }
    };


  return (
    <div className="resultados-container">

      {!cerrada && (
        <div className="estado-previo">
          <p className="mensaje-info">
            La mesa aún no está cerrada. Los resultados estarán disponibles una vez finalizada la votación.
          </p>
          <button
            className="boton-celeste"
            onClick={cerrarMesa}
            disabled={cerrando || !circuito?.idEleccion || !circuito?.idCircuito}
          >
            {cerrando ? "Cerrando mesa..." : "Cerrar mesa manualmente"}
          </button>
          {(!circuito?.idEleccion || !circuito?.idCircuito) && (
            <p className="mensaje-espera">Esperando datos del circuito...</p>
          )}
        </div>
      )}

      {cerrada && (
        <div className="lista-resultados">
          {datos.length === 0 ? (
            <p className="mensaje-info">No hay votos registrados aún.</p>
          ) : (
            <ul>
              {datos.map((r, i) => (
                <li key={i} className="resultado-item">
                  <strong>Lista {r.nombreLista}</strong>: {r.votos} voto(s)
                  {r.votosObservados > 0 && (
                    <span className="observados"> (Observados: {r.votosObservados})</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}