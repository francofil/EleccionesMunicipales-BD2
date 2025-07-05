import './CircuitosList.css';

export default function CircuitosList({ circuitos, onEdit, onDelete, onEstado }) {
  return (
    <ul className="circuitos-list">
      {circuitos.map(c => (
        <li key={c.id} className="circuito-item">
          <h3 className="titulo-circuito">Circuito {c.id}</h3>
          <p><strong>Zona:</strong> {c.zona}</p>
          <p><strong>Tipo:</strong> {c.tipo}</p>
          <p><strong>Accesible:</strong> {c.accesible ? 'Sí' : 'No'}</p>
          <p><strong>Dirección:</strong> {c.direccion}</p>
          <p><strong>Establecimiento:</strong> {c.idEstablecimiento}</p>
          <p><strong>Departamento:</strong> {c.idDepartamento}</p>

          <button className="boton editar" onClick={() => onEdit(c)}>✏️ Editar</button>
          <button className="boton eliminar" onClick={() => onDelete(c.id)}>🗑 Eliminar</button>
          <button className="boton estado" onClick={() => onEstado(c)}>⚙ Estado</button>

        </li>

      ))}
    </ul>
  );
}
