const baseUrl = "http://localhost:3000";

export async function fetchCircuitos() {
  const token = localStorage.getItem('token');

  const res = await fetch(`${baseUrl}/circuito`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error ${res.status}: ${errorText}`);
  }

  return await res.json(); // Lista de circuitos
}

export async function createCircuito(circuitoData) {
  const token = localStorage.getItem('token');

  const res = await fetch(baseUrl + '/circuito', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(circuitoData)
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Error ${res.status}: ${error}`);
  }

  return await res.json(); // { message: 'Circuito creado', id }
}

export async function deleteCircuito(id) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${baseUrl}/circuito/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Error ${res.status}: ${error}`);
  }

  return await res.json(); // { message: 'Circuito eliminado' }
}
export async function updateCircuito(id, updatedData) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${baseUrl}/circuito/${id}`, {
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

  return await res.json(); // { message: 'Circuito actualizado' }
}

export async function fetchVotantesByCircuito(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${baseUrl}/circuito/${id}/votantes`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json(); // arreglo de votantes
}


