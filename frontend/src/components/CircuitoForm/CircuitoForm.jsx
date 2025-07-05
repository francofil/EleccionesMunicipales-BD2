import { useState } from 'react';
import { createCircuito, updateCircuito } from '../../services/circuitoService';
import './CircuitoForm.css';
import { useEffect } from 'react';
import { vincularCircuitoAEleccion } from '../../services/eleccionCircuitoService'

export default function CircuitoForm({ onClose, onSaved, circuito }) {

  useEffect(() => {
    setForm({

      zona: circuito?.zona || '',
      tipo: circuito?.tipo || '',
      accesible: circuito?.accesible || false,
      direccion: circuito?.direccion || '',
      idEstablecimiento: circuito?.idEstablecimiento || '',
      idDepartamento: circuito?.idDepartamento || '',
    });
  }, [circuito]);


  const [form, setForm] = useState({

    zona: '',
    tipo: '',
    accesible: false,
    direccion: '',
    idEstablecimiento: '',
    idDepartamento: '',

  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

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

    // Validaciones básicas
    if (!form.zona || !form.tipo || !form.direccion) {
      setError('Por favor, completá todos los campos obligatorios.');
      return;
    }

    try {
      let response;


      if (circuito) {
        await updateCircuito(circuito.id, form);

        setMensaje('✅ Circuito actualizado correctamente.');
      } else {
        response = await createCircuito(form);

        setMensaje('✅ Circuito creado correctamente.');

        console.log("Respuesta de createCircuito:", response);

        await vincularCircuitoAEleccion(form.idEleccion, response.id, form.idMesa, form.ciAgente, false);
      }


      // Actualizar lista sin recargar
      onSaved?.({ ...form, id: response.id || circuito?.id }); // id puede venir en la respuesta
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError('⚠ Error: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-circuito">
      <h3>{circuito ? 'Editar Circuito' : 'Nuevo Circuito'}</h3>

      {mensaje && <p className="mensaje-exito">{mensaje}</p>}
      {error && <p className="mensaje-error">{error}</p>}

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
        <input name="idEstablecimiento" value={form.idEstablecimiento} onChange={handleChange} />
      </label>

      <label>
        Departamento (ID):
        <input name="idDepartamento" value={form.idDepartamento} onChange={handleChange} />
      </label>
      <label>Mesa (ID):
        <input name="idMesa" value={form.idMesa} onChange={handleChange} />
      </label>
      <label>CI Agente:
        <input name="ciAgente" value={form.ciAgente} onChange={handleChange} />
      </label>
      <label>ID Elección:
        <input name="idEleccion" value={form.idEleccion} onChange={handleChange} />
      </label>

      <div className="botones-formulario">
        <button type="submit">Guardar</button>
        <button type="button" className="boton-cancelar" onClick={onClose}>Cancelar</button>
      </div>
    </form>
  );
}
