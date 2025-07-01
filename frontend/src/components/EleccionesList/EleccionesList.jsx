import './EleccionesList.css';

export default function EleccionesList({ elecciones, onEdit, onDelete }) {
  return (
    <ul className="elecciones-list">
      {elecciones.map(e => (
        <li key={e.id} className="eleccion-item">
          <strong>Fecha:</strong> {new Date(e.fecha).toLocaleDateString()} — 
          <strong> Tipo:</strong> {e.tipo}
          <button onClick={() => onEdit(e)}>✏️ Editar</button>  
          <button onClick={() => onDelete(e.id)}>🗑 Eliminar</button>      
        </li>
      ))}
    </ul>
  );
}