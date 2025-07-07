const baseUrl = "http://localhost:3000";

const authHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export async function obtenerCircuitoDelPresidente(ci) {
  const res = await fetch(`${baseUrl}/presidente/circuito/${ci}`, {
    headers: authHeaders()
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json(); 
}
