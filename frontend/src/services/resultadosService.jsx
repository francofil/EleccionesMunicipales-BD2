// src/services/resultadosService.js
const baseUrl = 'http://localhost:3000';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

// 1. Lista más votada (opcionalmente por circuito)
export async function obtenerListaMasVotada(idEleccion, idCircuito = null) {
  const url = new URL(`${baseUrl}/resultados/lista-mas-votada`);
  url.searchParams.append('idEleccion', idEleccion);
  if (idCircuito) url.searchParams.append('idCircuito', idCircuito);

  const res = await fetch(url, { headers: authHeaders() });

  if (!res.ok) throw new Error(await res.text());
  return await res.json(); // { idLista, partido, cantidadVotos, porcentaje, total }
}

// 2. Votos por partido (opcionalmente por circuito)
export async function obtenerVotosPorPartido(idEleccion, idCircuito = null) {
  const url = new URL(`${baseUrl}/resultados/votos-por-partido`);
  url.searchParams.append('idEleccion', idEleccion);
  if (idCircuito) url.searchParams.append('idCircuito', idCircuito);

  const res = await fetch(url, { headers: authHeaders() });

  if (!res.ok) throw new Error(await res.text());
  return await res.json(); // { total, resultados: [{ partido, votos, porcentaje }] }
}

// 3. Resultados por circuito (solo si se pasa ambos ID)
export async function obtenerResultadosPorCircuito(idEleccion, idCircuito) {
  const res = await fetch(`${baseUrl}/resultados/resultadosCircuito/${idEleccion}/${idCircuito}`, {
    headers: authHeaders()
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json(); // { total, resultados: [{ partido, candidato, votos, porcentaje }] }
}
