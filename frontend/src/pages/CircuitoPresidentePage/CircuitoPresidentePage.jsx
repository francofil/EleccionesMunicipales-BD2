// src/pages/CircuitoPresidentePage/CircuitoPresidentePage.jsx
import { useState } from 'react';
import CircuitosList from '../../components/CircuitosList/CircuitosList';
import CircuitoEstadoModal from '../../components/CircuitoEstadoModal/CircuitoEstadoModal';
import { useCircuitoPresidente } from '../../hooks/useCircuitoPresidente';

export default function CircuitoPresidentePage() {
  const { circuito, loading, error } = useCircuitoPresidente();
  const [modalCircuito, setModalCircuito] = useState(null);

  if (loading) return <p>Cargando circuito…</p>;
  if (error)   return <p style={{ color: 'red' }}>⚠ {error}</p>;

  return (
    <>

      {circuito ? (
        <CircuitosList
          circuitos={[circuito]}
          onEstado={setModalCircuito}
        />
      ) : (
        <p>No tenés un circuito asignado.</p>
      )}

      {modalCircuito && (
        <CircuitoEstadoModal
          idEleccion={circuito.idEleccion}
          circuito={modalCircuito}
          onClose={() => setModalCircuito(null)}
        />
      )}
    </>
  );
}
