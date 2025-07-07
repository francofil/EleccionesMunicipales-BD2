import './ResultadosList.css';

export default function ResultadosList({ resultados }) {
  return (
    <ul className="resultados-list">
      {resultados.map((r, index) => (
        <li key={index} className="resultados-item">
          <p><strong>Candidato:</strong> {r.candidato || 'Desconocido'}</p>
          <p><strong>Partido:</strong> {r.partido || 'Desconocido'}</p>
          <p><strong>Cantidad de votos:</strong> {r.cantidad || r.votos}</p>
          <p><strong>Porcentaje:</strong> {r.porcentaje || '0.00'}%</p>
          {r.circuito && <p><strong>Circuito:</strong> {r.circuito}</p>}
        </li>
      ))}
    </ul>
  );
}
