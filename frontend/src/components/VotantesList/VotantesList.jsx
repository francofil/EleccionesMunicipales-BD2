import './votantesList.css'; // o el nuevo nombre si lo cambiaste

export default function VotantesList({ votantes }) {
  return (
    <ul className="votantes-list">
      {votantes.map(v => (
        <li key={v.credencial} className="votantes-item">
          <p><strong>Nombre:</strong> {v.nombre}</p>
          <p><strong>Apellido:</strong> {v.apellido}</p>
          <p><strong>CI:</strong> {v.ci}</p>
          <p><strong>Credencial:</strong> {v.credencial}</p>
          

        </li>
      ))}
    </ul>
  );
}
