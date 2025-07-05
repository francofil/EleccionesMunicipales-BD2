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
