const baseUrl = "http://localhost:3000"

export async function loginVotante({ cedula, credencial }) {
  const res = await fetch(baseUrl + '/votantes/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cedula, credencial })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Login fallido');
  }

  return await res.json(); // { token }
}
