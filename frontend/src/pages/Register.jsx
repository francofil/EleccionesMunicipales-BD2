//Solo para registrar los usuarios admin y presidentes con las contraseñas hasheadas
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login/Login.css';

export default function Register() {
  const navigate = useNavigate();
  const [ci, setCi] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('presidente'); // predeterminado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ci, username, password, rol })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al registrar usuario');
      }

      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img
          src="/escudo-uruguay.png"
          alt="Escudo Nacional"
          className="login-logo"
        />
        <h2>Registro de usuario</h2>
        <p>Registrá un usuario administrador o presidente.</p>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="ci">Cédula</label>
            <input type="text" id="ci" value={ci} onChange={(e) => setCi(e.target.value)} required />
          </div>
          <div className="input-group">
            <label htmlFor="username">Nombre de usuario</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="input-group">
            <label htmlFor="rol">Rol</label>
            <select id="rol" value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="admin">Administrador</option>
              <option value="presidente">Presidente</option>
            </select>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar usuario'}
          </button>
          {error && <p className="error-message">⚠ {error}</p>}
        </form>
      </div>
    </div>
  );
}
