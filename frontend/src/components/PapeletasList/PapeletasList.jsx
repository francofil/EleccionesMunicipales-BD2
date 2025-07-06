import './PapeletasList.css';

export default function PapeletasList({ papeletas }) {
  return (
    <ul className="papeletas-list">
      {papeletas.map(p => (
        <li key={p.id} className="papeletas-item">
          <h3 className="titulo-papeletas">Papeleta {p.id}</h3>
          <p><strong>Color:</strong> {p.color}</p>
          <p><strong>Elección:</strong> {p.eleccion}</p>
          <p><strong>Partido:</strong> {p.partidoNombre}</p>
        </li>
      ))}
    </ul>
  );
}
