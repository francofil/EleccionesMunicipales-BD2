const baseUrl = "http://localhost:3000";

const authHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export async function obtenerPartidos() {
  const res = await fetch(`${baseUrl}/partidos`, {
    headers: authHeaders()
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json(); // Se espera: [{ id, idPapeleta, nombre, direccion, autoridades }]
}
