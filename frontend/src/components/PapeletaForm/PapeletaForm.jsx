import { useState } from 'react';
import { crearPapeleta } from '../../services/papeletaService';
import './PapeletaForm.css';  

export default function PapeletaForm({ onClose, setPapeletas }) {
  const [form, setForm] = useState({
    color: '',
    eleccion: '',
    idPartido: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    // Validación básica
    if (!form.color || !form.eleccion || !form.idPartido) {
      setError('Por favor, completá todos los campos obligatorios.');
      return;
    }

    try {
      const nueva = await crearPapeleta(form);
      setMensaje('✅ Papeleta creada correctamente.');

       if (setPapeletas) {
        setPapeletas(prev => [...prev, nueva]);
      }

      setTimeout(() => {
        setMensaje('');
        onClose();
      }, 1500); // demora para que se vea el mensaje

    } catch (err) {
      setError('Error al crear la papeleta: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-circuito">
      <h3>Nueva Papeleta</h3>

      {mensaje && <p className="mensaje-exito">{mensaje}</p>}
      {error && <p className="mensaje-error">{error}</p>}

      <label>
        Color:
        <input name="color" value={form.color} onChange={handleChange} required />
      </label>

      <label>
        ID Elección:
        <input name="eleccion" value={form.eleccion} onChange={handleChange} required />
      </label>

      <label>
        ID Partido:
        <input name="idPartido" value={form.idPartido} onChange={handleChange} required />
      </label>

      <div className="botones-formulario">
        <button type="submit">Guardar</button>
        <button type="button" className="boton-cancelar" onClick={onClose}>Cancelar</button>
      </div>
    </form>
  );
}
