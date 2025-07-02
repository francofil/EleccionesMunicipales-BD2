import './CircuitosList.css';

export default function CircuitosList({ circuitos, onEdit, onDelete , onShowVotantes,onEstado}) {
  return (
    <ul className="circuitos-list">
      {circuitos.map(c => (
       <li key={c.id} className="circuito-item">
  <p><strong>Zona:</strong> {c.zona}</p>
  <p><strong>Tipo:</strong> {c.tipo}</p>
  <p><strong>Accesible:</strong> {c.accesible ? 'Sí' : 'No'}</p>
  <p><strong>Dirección:</strong> {c.direccion}</p>
  <p><strong>Establecimiento:</strong> {c.idEstablecimiento}</p>
  <p><strong>CI Agente:</strong> {c.ciAgente}</p>
  <p><strong>Departamento:</strong> {c.idDepartamento}</p>
  <p><strong>Mesa:</strong> {c.idMesa}</p>

  <button onClick={() => onEdit(c)}>✏️ Editar</button>
  <button onClick={() => onDelete(c.id)}>🗑 Eliminar</button>
  <button onClick={() => onShowVotantes(c.id)}>👥 Votantes</button>
<button onClick={() => onEstado(c)}>⚙ Estado</button>

</li>

      ))}
    </ul>
  );
}
