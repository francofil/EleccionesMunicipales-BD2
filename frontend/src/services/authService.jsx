const baseUrl = "http://localhost:3000"

export async function loginUser({ username, password }) {
  const res = await fetch(baseUrl + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Login fallido');
  }

  return await res.json(); // { token }
}

export async function registerUser({ ci, username, password, rol }) {
  const res = await fetch(baseUrl + '/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ci, username, password, rol})
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'No se pudo registrar al usuario');
  }

  return await res.json(); // { token }
}
