
import { useState } from 'react'
import './Login.css';
import { useLogin } from '../../hooks/useLogin'

export default function Login() {
  const { login, loading, error } = useLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    await login({ username, password });

  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img
          src="/escudo-uruguay.png"
          alt="Escudo Nacional"
          className="login-logo"
        />
        <h2>Iniciar sesión</h2>
        <p>Iniciá sesión con tu usuario de la <strong>corte electoral</strong>.</p>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Nombre de usuario</label>
            <input type="text" id="username" placeholder="Ingrese su nombre de usuario." value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" placeholder="Ingrese su contraseña." value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="forgot-password">
            ¿Olvidaste tu contraseña? <a href="#">Recuperar.</a>
          </div>
          <button type="submit" className="login-button" disabled={loading}>{loading ? 'Cargando...' : 'Iniciar sesión'}</button>
          {error && <p className="error-message">El nombre de usuario o contraseña son incorrecto</p>}
        </form>
      </div>
    </div>
  );
}
