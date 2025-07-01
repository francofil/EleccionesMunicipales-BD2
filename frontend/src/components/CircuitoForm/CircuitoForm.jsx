import { useState } from 'react';
import { createCircuito } from '../../services/circuitoService';
import { updateCircuito } from '../../services/circuitoService';

export default function CircuitoForm({ onClose, circuito }) {
   const [form, setForm] = useState({
    zona: circuito?.zona || '',
    tipo: circuito?.tipo || '',
    accesible: circuito?.accesible || false,
    direccion: circuito?.direccion || '',
    idEstablecimiento: circuito?.idEstablecimiento || '',
    ciAgente: circuito?.ciAgente || '',
    idDepartamento: circuito?.idDepartamento || '',
    idMesa: circuito?.idMesa || ''
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (circuito) {
        await updateCircuito(circuito.id, form);
        alert('Circuito actualizado');
      } else {
        await createCircuito(form);
        alert('Circuito creado');
      }
      onClose();
      window.location.reload(); // luego mejoramos esto
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-circuito">
      <h3>Nuevo Circuito</h3>

      <label>
        Zona:
        <input name="zona" value={form.zona} onChange={handleChange} required />
      </label>

      <label>
        Tipo:
        <input name="tipo" value={form.tipo} onChange={handleChange} required />
      </label>

      <label>
        Accesible:
        <input type="checkbox" name="accesible" checked={form.accesible} onChange={handleChange} />
      </label>

      <label>
        Dirección:
        <input name="direccion" value={form.direccion} onChange={handleChange} required />
      </label>

      <label>
        Establecimiento (ID):
        <input name="idEstablecimiento" value={form.idEstablecimiento} onChange={handleChange} required />
      </label>

      <label>
        CI Agente:
        <input name="ciAgente" value={form.ciAgente} onChange={handleChange} required />
      </label>

      <label>
        Departamento (ID):
        <input name="idDepartamento" value={form.idDepartamento} onChange={handleChange} required />
      </label>

      <label>
        Mesa (ID):
        <input name="idMesa" value={form.idMesa} onChange={handleChange} required />
      </label>

      <button type="submit">Guardar</button>
      <button type="button" onClick={onClose}>Cancelar</button>
    </form>
  );
}
