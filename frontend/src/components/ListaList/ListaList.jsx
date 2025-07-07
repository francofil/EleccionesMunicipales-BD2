import './ListaList.css';

export default function ListaList({ listas }) {
  return (
    <ul className="lista-list">
      {listas.map(lista => (
        <li key={lista.id} className="lista-item">
          <h3>Lista {lista.id}</h3>
          <p><strong>Órgano:</strong> {lista.organo}</p>
          <p><strong>Departamento:</strong> {lista.departamento}</p>
          <p><strong>Color:</strong> {lista.color}</p>
          <p><strong>Partido:</strong> {lista.partidoNombre}</p>
        </li>
      ))}
    </ul>
  );
}
