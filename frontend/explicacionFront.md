# 🧠 Login con React + JWT (Resumen)

Este documento resume la estructura profesional de cómo implementar login con JWT en un frontend React, usando `services`, `hooks` y un componente limpio.

---

## 📁 Estructura del proyecto

```
src/
├── pages/
│   └── Login.jsx          ← componente de UI
├── hooks/
│   └── useLogin.js        ← maneja lógica de login
├── services/
│   └── authService.js     ← hace el fetch a la API
└── utils/
    └── auth.js            ← guarda/lee token del localStorage
```

---

## 🔌 services/authService.js

```js
export async function loginUser({ username, password }) {
  const res = await fetch('http://localhost:3000/api/auth/login', {
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
```

---

## 🧠 hooks/useLogin.js

```js
import { useState } from 'react';
import { loginUser } from '../services/authService';
import { saveToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async ({ username, password }) => {
    setLoading(true);
    try {
      const { token } = await loginUser({ username, password });
      saveToken(token);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
```

---

## 📄 pages/Login.jsx

```jsx
import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin';

export default function Login() {
  const { login, loading, error } = useLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ username, password });
  };

  return (
    <div className="login">
      <h2>Iniciar sesión</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Cargando...</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>Ingresar</button>
      </form>
    </div>
  );
}
```

---

## 🔐 utils/auth.js

```js
export function saveToken(token) {
  localStorage.setItem('token', token);
}

export function getToken() {
  return localStorage.getItem('token');
}

export function removeToken() {
  localStorage.removeItem('token');
}
```

---

## ✅ Buenas prácticas

- `services/`: para la comunicación con la API (sin lógica React)
- `hooks/`: para lógica reactiva (`loading`, `error`, navegación)
- `pages/`: solo manejan el UI
