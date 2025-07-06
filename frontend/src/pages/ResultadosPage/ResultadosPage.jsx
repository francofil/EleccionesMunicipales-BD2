import { useState, useEffect } from 'react';
import { getResultados } from '../../services/resultadosService';
import Buscador from '../../components/Buscador/Buscador';
import ResultadosList from '../../components/ResultadosList/ResultadosList';

export default function ResultadosPage() {
  const [resultados, setResultados] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const rol = localStorage.getItem('rol'); 
  const circuitoId = localStorage.getItem('circuitoId'); 

  useEffect(() => {
    const fetchResultados = async () => {
      try {
        const data = await getResultados(rol, circuitoId);
        setResultados(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResultados();
  }, [rol, circuitoId]);

  const resultadosFiltrados = resultados.filter(r =>
    r.lista?.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) return <p>Cargando…</p>;
  if (error) return <p style={{ color: 'red' }}>⚠ {error}</p>;

  return (
    <div className="resultados-container">
      {rol === 'admin' && (
        <Buscador placeholder="Buscar lista o papeleta…" onBuscar={setFiltro} />
      )}
      <ResultadosList resultados={rol === 'admin' ? resultadosFiltrados : resultados} />
    </div>
  );
}