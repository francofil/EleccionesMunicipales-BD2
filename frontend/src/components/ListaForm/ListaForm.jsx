import { useState } from 'react';
import { crearPapeleta } from '../../services/papeletaService';
import { crearLista } from '../../services/listaService';
import { obtenerPartidos } from '../../services/partidoService';
import './ListaForm.css';

export default function ListaForm({ onClose, setListas }) {
  const [form, setForm] = useState({
    color: '',
    eleccion: '',
    idPartido: '',
    organo: '',
    departamento: ''
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

    if (!form.color || !form.eleccion || !form.idPartido || !form.organo || !form.departamento) {
      setError('Por favor, completá todos los campos.');
      return;
    }

    try {
      // 1. Crear Papeleta
      const { id } = await crearPapeleta({
        color: form.color,
        eleccion: form.eleccion,
        idPartido: form.idPartido
      });

      // 2. Crear Lista con el id de la Papeleta
      await crearLista({
        id,
        organo: form.organo,
        departamento: form.departamento
      });
 const partidos = await obtenerPartidos();
      const partido = partidos.find(p => p.id === parseInt(form.idPartido));
      const partidoNombre = partido ? partido.nombre : '(sin nombre)';
      setMensaje('✅ Lista creada correctamente.');

      setListas?.(prev => [...prev, {
        id,
        organo: form.organo,
        departamento: form.departamento,
        color: form.color,
        partidoNombre
      }]);

      setTimeout(() => {
        setMensaje('');
        onClose();
      }, 1500);

    } catch (err) {
      setError('❌ Error: ' + err.message);
    }
  };

  return (
    <form className="formulario-lista" onSubmit={handleSubmit}>
      <h3>Nueva Lista</h3>
      {mensaje && <p className="mensaje-exito">{mensaje}</p>}
      {error && <p className="mensaje-error">{error}</p>}

      <label>
        Color:
        <input name="color" value={form.color} onChange={handleChange} />
      </label>

      <label>
        ID Elección:
        <input name="eleccion" value={form.eleccion} onChange={handleChange} />
      </label>

      <label>
        ID Partido:
        <input name="idPartido" value={form.idPartido} onChange={handleChange} />
      </label>

      <label>
        Órgano:
        <input name="organo" value={form.organo} onChange={handleChange} />
      </label>

      <label>
        Departamento:
        <input name="departamento" value={form.departamento} onChange={handleChange} />
      </label>

      <div className="botones-formulario">
        <button type="submit">Guardar</button>
        <button type="button" onClick={onClose} className="boton-cancelar">Cancelar</button>
      </div>
    </form>
  );
}
