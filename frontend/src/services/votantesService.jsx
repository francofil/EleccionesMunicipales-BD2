const baseUrl = "http://localhost:3000";

/* Helper para obtener el token y armar headers */
const authHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

/* ──────────────────────────────────────────────
   1) Obtener todos los votantes
   GET /votantes
─────────────────────────────────────────────── */
export async function obtenerVotantes() {
  const res = await fetch(`${baseUrl}/votantes`, {
    headers: authHeaders()
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();         // Array de votantes
}

/* ──────────────────────────────────────────────
   2) Crear un votante
   POST /votantes
   body: { ci, credencial, nombre, apellido, fecha_nacimiento }
─────────────────────────────────────────────── */
export async function crearVotante(data) {
  const res = await fetch(`${baseUrl}/votantes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();         // { message: 'Votante creado' }
}

/* ──────────────────────────────────────────────
   3) Obtener votante por CI
   GET /votantes/:ci
─────────────────────────────────────────────── */
export async function obtenerVotantePorCI(ci) {
  const res = await fetch(`${baseUrl}/votantes/${ci}`, {
    headers: authHeaders()
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();         // Objeto votante
}

/* ──────────────────────────────────────────────
   4) Obtener votante por credencial
   GET /votantes/credencial/:cc
─────────────────────────────────────────────── */
export async function obtenerVotantePorCredencial(cc) {
  const res = await fetch(`${baseUrl}/votantes/credencial/${cc}`, {
    headers: authHeaders()
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();         // Objeto votante
}

/* ──────────────────────────────────────────────
   (Opcional) Actualizar o eliminar votante
   Uncomment si los necesitas
─────────────────────────────────────────────── */
// export async function actualizarVotante(ci, data) {
//   const res = await fetch(`${baseUrl}/votantes/${ci}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json', ...authHeaders() },
//     body: JSON.stringify(data)
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return await res.json(); // { message: 'Votante actualizado' }
// }

// export async function eliminarVotante(ci) {
//   const res = await fetch(`${baseUrl}/votantes/${ci}`, {
//     method: 'DELETE',
//     headers: authHeaders()
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return await res.json(); // { message: 'Votante eliminado' }
// }

export async function obtenerVotantesPorCircuito(idCircuito) {
  const res = await fetch(`${baseUrl}/circuitos/${idCircuito}/votantes`, {
    headers: authHeaders()
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json(); // Array de votantes del circuito
}
