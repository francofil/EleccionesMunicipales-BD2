import './CircuitosList.css';

export default function CircuitosList({ circuitos, onEdit, onDelete }) {
  return (
    <ul className="circuitos-list">
      {circuitos.map(c => (
        <li key={c.id} className="circuito-item">
          <strong>Zona:</strong> {c.zona} — <strong>Dirección:</strong> {c.direccion}
 <button onClick={() => onEdit(c)}>✏️ Editar</button>  
 <button onClick={() => onDelete(c.id)}>🗑 Eliminar</button>      
        </li>
      ))}
    </ul>
  );
}
