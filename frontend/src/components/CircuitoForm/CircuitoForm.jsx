import { useState, useEffect } from 'react';
import { createCircuito, updateCircuito } from '../../services/circuitoService';
import { vincularCircuitoAEleccion } from '../../services/eleccionCircuitoService';
import './CircuitoForm.css';

export default function CircuitoForm({ onClose, onSaved, circuito }) {
  const isEditing = Boolean(circuito);

  const [form, setForm] = useState({
    zona: '',
    tipo: '',
    accesible: false,
    direccion: '',
    idEstablecimiento: '',
    idDepartamento: '',
    idMesa: '',
    ciAgente: '',
    idEleccion: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (circuito) {
      setForm({
        zona: circuito.zona || '',
        tipo: circuito.tipo || '',
        accesible: circuito.accesible || false,
        direccion: circuito.direccion || '',
        idEstablecimiento: circuito.idEstablecimiento || '',
        idDepartamento: circuito.idDepartamento || '',
        idMesa: '', // no lo cargues en edición
        ciAgente: '',
        idEleccion: ''
      });
    }
  }, [circuito]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!form.zona || !form.tipo || !form.direccion) {
      setError('Por favor, completá todos los campos obligatorios.');
      return;
    }

    try {
      let response;

      if (isEditing) {
        await updateCircuito(circuito.id, form);
        setMensaje('✅ Circuito actualizado correctamente.');
      } else {
        response = await createCircuito(form);
        await vincularCircuitoAEleccion(form.idEleccion, response.id, form.idMesa, form.ciAgente, false);
        setMensaje('✅ Circuito creado correctamente.');
      }

      onSaved?.({ ...form, id: response?.id || circuito?.id });
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError('⚠ Error: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-circuito">
      <h3>{isEditing ? 'Editar Circuito' : 'Nuevo Circuito'}</h3>

      {mensaje && <p className="mensaje-exito">{mensaje}</p>}
      {error && <p className="mensaje-error">{error}</p>}

      <label>Zona:
        <input name="zona" value={form.zona} onChange={handleChange} required />
      </label>

      <label>Tipo:
        <input name="tipo" value={form.tipo} onChange={handleChange} required />
      </label>

      <label>Accesible:
        <input type="checkbox" name="accesible" checked={form.accesible} onChange={handleChange} />
      </label>

      <label>Dirección:
        <input name="direccion" value={form.direccion} onChange={handleChange} required />
      </label>

      <label>Establecimiento (ID):
        <input name="idEstablecimiento" value={form.idEstablecimiento} onChange={handleChange} />
      </label>

      <label>Departamento (ID):
        <input name="idDepartamento" value={form.idDepartamento} onChange={handleChange} />
      </label>

      {!isEditing && (
        <>
          <label>Mesa (ID):
            <input name="idMesa" value={form.idMesa} onChange={handleChange} required />
          </label>

          <label>CI Agente:
            <input name="ciAgente" value={form.ciAgente} onChange={handleChange} required />
          </label>

          <label>ID Elección:
            <input name="idEleccion" value={form.idEleccion} onChange={handleChange} required />
          </label>
        </>
      )}

      <div className="botones-formulario">
        <button type="submit">Guardar</button>
        <button type="button" className="boton-cancelar" onClick={onClose}>Cancelar</button>
      </div>
    </form>
  );
}
