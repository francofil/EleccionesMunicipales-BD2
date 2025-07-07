const baseUrl = "http://localhost:3000";

const authHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export async function obtenerPapeletas() {
  const res = await fetch(`${baseUrl}/papeletas`, {
    headers: authHeaders()
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json(); // Se espera que devuelva: [{id, color, eleccion, tipo}]
}
export async function obtenerPapeletasPorEleccion(idEleccion) {
  const res = await fetch(`${baseUrl}/papeletas/eleccion/${idEleccion}`, {
    headers: authHeaders()
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
export async function crearPapeleta(data) {
  const res = await fetch(`${baseUrl}/papeletas`, {
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

