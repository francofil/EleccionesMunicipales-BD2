import './ResultadosPage.css';
import { useState } from 'react';

export default function ResultadosPage({ resultados, circuito, estadoMesa }) {
  const [cerrando, setCerrando] = useState(false);
  const [cerrada, setCerrada] = useState(estadoMesa?.mesaCerrada || false);
  const [datos, setDatos] = useState(resultados || []);
  const token = localStorage.getItem('token');

  const cerrarMesa = async () => {
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

      const nuevosResultados = await res.json(); // Suponiendo que devuelve resultados
      setDatos(nuevosResultados);
      setCerrada(true);
    } catch (error) {
      alert('Error al cerrar la mesa: ' + error.message);
    } finally {
      setCerrando(false);
    }
  };

  if (!cerrada) {
    return (
      <div>
        <p>La mesa aún no está cerrada. Los resultados estarán disponibles una vez finalizada la votación.</p>
        <button onClick={cerrarMesa} disabled={cerrando}>
          {cerrando ? "Cerrando mesa..." : "Cerrar mesa manualmente"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3>Resultados</h3>
      {datos.length === 0 ? (
        <p>No hay votos registrados aún.</p>
      ) : (
        <ul>
          {datos.map((r, i) => (
            <li key={i}>
              Lista {r.nombreLista}: {r.votos} voto(s)
              {r.votosObservados > 0 && ` (Observados: ${r.votosObservados})`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
