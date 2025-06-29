import { useEffect, useState } from 'react';
import './CircuitosList.css';

export default function CircuitosList() {
  const [circuitos, setCircuitos] = useState([]);

  useEffect(() => {
    const fetchCircuitos = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/circuitos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setCircuitos(data);
    };
    fetchCircuitos();
  }, []);
return (
  <div className="circuitos-container">
    <ul className="circuitos-list">
      {circuitos.map(c => (
        <li className="circuito-item" key={c.id}>
          <strong>Zona:</strong> {c.zona}, <strong>Dirección:</strong> {c.direccion}
        </li>
      ))}
    </ul>
  </div>
);

}
