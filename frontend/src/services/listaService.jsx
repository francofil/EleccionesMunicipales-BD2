const baseUrl = "http://localhost:3000";

const authHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export async function crearLista(data) {
  const res = await fetch(`${baseUrl}/lista`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders()
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json(); // devuelve { message, id }
}

export async function obtenerListasPorEleccion(idEleccion) {
  const res = await fetch(`${baseUrl}/lista/eleccion/${idEleccion}`, {
    headers: authHeaders()
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json(); // [{ id, organo, departamento, color, partidoNombre }]
}
