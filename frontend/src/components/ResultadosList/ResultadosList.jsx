import './ResultadosList.css';

export default function ResultadosList({ resultados }) {
  return (
    <ul className="resultados-list">
      {resultados.map((r, index) => (
        <li key={index} className="resultados-item">
          <p><strong>Lista:</strong> {r.lista}</p>
          <p><strong>Cantidad de votos:</strong> {r.cantidad}</p>
          <p><strong>Porcentaje:</strong> {r.porcentaje}%</p>
          {r.circuito && <p><strong>Circuito:</strong> {r.circuito}</p>}
        </li>
      ))}
    </ul>
  );
}
