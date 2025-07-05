import './Buscador.css';

export default function Buscador({ placeholder, onBuscar }) {
  return (
    <input
      type="text"
      className="buscador-input"
      placeholder={placeholder || 'Buscar...'}
      onChange={(e) => onBuscar(e.target.value)}
    />
  );
}
