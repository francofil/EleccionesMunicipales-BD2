import { useState } from 'react';
import { createEleccion, updateEleccion } from '../../services/eleccionService';

export default function EleccionForm({ onClose, eleccion }) {
  const [form, setForm] = useState({
    fecha: eleccion?.fecha || '',
    tipo: eleccion?.tipo || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (eleccion) {
        await updateEleccion(eleccion.id, form);
        alert('Elección actualizada');
      } else {
        await createEleccion(form);
        alert('Elección creada');
      }
      onClose();
      window.location.reload();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-eleccion">
      <h3>{eleccion ? 'Editar' : 'Nueva'} Elección</h3>

      <label>
        Fecha:
        <input 
          type="date" 
          name="fecha" 
          value={form.fecha} 
          onChange={handleChange} 
          required 
        />
      </label>

      <label>
        Tipo:
        <select 
          name="tipo" 
          value={form.tipo} 
          onChange={handleChange} 
          required
        >
          <option value="">Seleccione un tipo</option>
          <option value="Municipal">Municipal</option>
          <option value="Departamental">Departamental</option>
          <option value="Nacional">Nacional</option>
        </select>
      </label>

      <button type="submit">Guardar</button>
      <button type="button" onClick={onClose}>Cancelar</button>
    </form>
  );
}