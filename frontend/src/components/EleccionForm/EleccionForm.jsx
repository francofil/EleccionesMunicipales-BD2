import { useState, useEffect } from 'react';
import { createEleccion, updateEleccion } from '../../services/eleccionService';
import './EleccionForm.css';

export default function EleccionForm({ onClose, onSaved, eleccion }) {
  const [form, setForm] = useState({
    fecha: '',
    tipo: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Actualiza el form cuando recibís eleccion para editar
  useEffect(() => {
    if (eleccion) {
      setForm({
        fecha: eleccion.fecha ? eleccion.fecha.substring(0, 10) : '', // formato yyyy-mm-dd
        tipo: eleccion.tipo || ''
      });
    } else {
      setForm({ fecha: '', tipo: '' });
    }
  }, [eleccion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      if (eleccion) {
        await updateEleccion(eleccion.id, form);
        onSaved?.({ ...form, id: eleccion.id });
        setMensaje('✅ Elección actualizada correctamente.');
      } else {
        const nueva=await createEleccion(form);
        onSaved?.({ ...form, id: nueva.id });
        setMensaje('✅ Elección creada correctamente.');
      }
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError('⚠ ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-eleccion">
      <h3>{eleccion ? 'Editar Elección' : 'Nueva Elección'}</h3>
      {mensaje && <p className="mensaje-exito">{mensaje}</p>}
      {error && <p className="mensaje-error">{error}</p>}

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

      <div className="botones-formulario">
        <button type="submit">Guardar</button>
        <button type="button" className="boton-cancelar" onClick={onClose}>Cancelar</button>
      </div>
    </form>
  );
}
