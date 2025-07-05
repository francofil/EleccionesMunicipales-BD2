import './PartidosList.css';

export default function PartidosList({ partidos }) {
  return (
    <ul className="partidos-list">
      {partidos.map(p => (
        <li key={p.id} className="partidos-item">
          <p><strong>ID:</strong> {p.id}</p>
          <p><strong>Nombre:</strong> {p.nombre}</p>
          <p><strong>Dirección:</strong> {p.direccion}</p>
          <p><strong>Autoridades:</strong> {p.autoridades}</p>
          <p><strong>ID Papeleta:</strong> {p.idPapeleta}</p>
        </li>
      ))}
    </ul>
  );
}
