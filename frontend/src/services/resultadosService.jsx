// src/services/resultadosService.js
const baseUrl = 'http://localhost:3000';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export async function getResultados(rol, circuitoId = null) {
  let url = `${baseUrl}/resultados`;

  if (rol === 'miembro' && circuitoId) {
    url += `?circuito=${circuitoId}`;
  }

  const res = await fetch(url, {
    headers: authHeaders()
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json(); // Devuelve array [{ lista, cantidad, porcentaje, circuito }]
}
