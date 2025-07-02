
import './Boton.css';

export default function Boton({ onClick, children, tipo = 'primario' }) {
  return (
    <button className={`boton ${tipo}`} onClick={onClick}>
      {children}
    </button>
  );
}
