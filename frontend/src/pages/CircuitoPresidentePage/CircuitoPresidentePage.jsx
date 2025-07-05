import { useState, useEffect } from 'react';
import CircuitosList from '../../components/CircuitosList/CircuitosList';
import CircuitoEstadoModal from '../../components/CircuitoEstadoModal/CircuitoEstadoModal';

export default function CircuitoPresidentePage() {
  const [circuito, setCircuito] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalCircuito, setModalCircuito] = useState(null);

  const idEleccionActual = 1;

  useEffect(() => {
    // Hardcodeamos un circuito de ejemplo:
    const circuitoFalso = 1;
    setCircuito(circuitoFalso);
    setLoading(false);
  }, []);

  const handleEstado = (circuito) => setModalCircuito(circuito);

  if (loading) return <p>Cargando circuito...</p>;

  return (
    <>
      <h1>Mi circuito asignado</h1>
      
      <CircuitosList
        circuitos={[circuito]}
        onEstado={handleEstado}
      />

      {modalCircuito && (
        <CircuitoEstadoModal
          idEleccion={idEleccionActual}
          circuito={modalCircuito}
          onClose={() => setModalCircuito(null)}
        />
      )}
    </>
  );
}
