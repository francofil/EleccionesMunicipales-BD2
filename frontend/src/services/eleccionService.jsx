const baseUrl = "http://localhost:3000";

export async function fetchElecciones() {
  const token = localStorage.getItem('token');

  const res = await fetch(`${baseUrl}/eleccion`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }

  return await res.json();
}

export async function createEleccion(eleccionData) {
  const token = localStorage.getItem('token');

  const res = await fetch(baseUrl + '/eleccion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(eleccionData)
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Error ${res.status}: ${error}`);
  }

  return await res.json();
}

export async function deleteEleccion(id) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${baseUrl}/eleccion/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Error ${res.status}: ${error}`);
  }

  return await res.json();
}

export async function updateEleccion(id, updatedData) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${baseUrl}/eleccion/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updatedData)
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Error ${res.status}: ${error}`);
  }

  return await res.json();
}