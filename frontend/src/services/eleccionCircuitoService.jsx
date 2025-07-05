const baseUrl = "http://localhost:3000";

export async function obtenerCircuitoEleccion(idEleccion, idCircuito) {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${baseUrl}/eleccionCircuito/estado/${idEleccion}/${idCircuito}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function cambiarEstadoMesa(idEleccion, idCircuito, estado) {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${baseUrl}/eleccionCircuito/estado/${idEleccion}/${idCircuito}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ mesaCerrada: estado })
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function agregarVotanteHabilitado(data) {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${baseUrl}/eleccionCircuito/habilitados`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function obtenerVotantesHabilitados(idEleccion, idCircuito) {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${baseUrl}/eleccionCircuito/habilitados/${idEleccion}/${idCircuito}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function verificarVotanteHabilitado(idEleccion, idCircuito, credencial) {
  const token = localStorage.getItem('token');
  
  const res = await fetch(`${baseUrl}/eleccionCircuito/habilitados/${idEleccion}/${idCircuito}/${credencial}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
export async function vincularCircuitoAEleccion(idEleccion, idCircuito, idMesa, ciAgente) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${baseUrl}/eleccionCircuito/vincular`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      idEleccion,
      idCircuito,
      idMesa,
      ciAgente
    })
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
