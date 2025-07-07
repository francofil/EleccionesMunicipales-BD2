import { useState } from 'react';
import { useResultados } from '../../hooks/useResultados';
import ResultadosList from '../../components/ResultadosList/ResultadosList';
import { cambiarEstadoMesa } from '../../services/eleccionCircuitoService';
import './ResultadosPage.css'
export default function ResultadosPage() {
  const [cerrando, setCerrando] = useState(false);
  const [trigger, setTrigger] = useState(0);
  const { resultados, listaMasVotada, votosPorPartido, loading, error, circuito, estadoMesa } = useResultados(trigger);
  const cerrada = estadoMesa?.mesaCerrada;

  const cerrarMesa = async () => {
    if (!circuito?.idEleccion || !circuito?.idCircuito) {
      alert("Los datos del circuito aún no están disponibles.");
      return;
    }

    setCerrando(true);
    try {
      await cambiarEstadoMesa(circuito.idEleccion, circuito.idCircuito, true);
      setTrigger(t => t + 1);  // refrescar datos
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
        <>
          {loading && <p className="mensaje-info">Cargando resultados...</p>}
          {error && <p className="mensaje-error">⚠ Error: {error}</p>}

          {!loading && !error && (
            <>
              {/* Lista más votada */}
{listaMasVotada && (
  <ul className="resultados-list">
    <li className="resultados-item">
      <h2>Lista Más Votada</h2>
      <p>{listaMasVotada.partido || listaMasVotada.nombreLista || 'Desconocida'}</p>
    </li>
  </ul>
)}

{/* Votos por partido */}
{votosPorPartido.length > 0 && (
  <ul className="resultados-list">
    <h2>Votos por Partido</h2>
    {votosPorPartido.map((vp, i) => (
      <li key={i} className="resultados-item">
        {vp.partido}: {vp.votos || vp.cantidad} votos
      </li>
    ))}
  </ul>
)}


              {/* Resultados detallados por candidato */}
              {resultados.length > 0 ? (
                <div className="lista-resultados">
                  <h2>Resultados Detallados</h2>
                  <ResultadosList resultados={resultados} />
                </div>
              ) : (
                <p>No hay votos registrados aún.</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
