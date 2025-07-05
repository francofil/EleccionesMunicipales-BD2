import './PapeletasList.css';

export default function PapeletasList({ papeletas }) {
  return (
    <ul className="votantes-list">
      {papeletas.map(p => (
        <li key={p.id} className="votantes-item">
          <p><strong>ID:</strong> {p.id}</p>
          <p><strong>Color:</strong> {p.color}</p>
          <p><strong>Elección:</strong> {p.eleccion}</p>
          <p><strong>Tipo:</strong> {p.tipo}</p>
        </li>
      ))}
    </ul>
  );
}
