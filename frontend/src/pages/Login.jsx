import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {

    const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // Simulación de validación simple
    if (user === 'presidente' && pass === '1234') {
      navigate('/inicio'); // Redirige al home
    } else {
      alert('Credenciales inválidas');
    }
  }

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
                <input type="text" id="username" placeholder="Ingrese su nombre de usuario." />
            </div>
            <div className="input-group">
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" placeholder="Ingrese su contraseña." />
            </div>
            <div className="forgot-password">
                ¿Olvidaste tu contraseña? <a href="#">Recuperar.</a>
            </div>
            <button type="submit" className="login-button">Iniciar sesión</button>
        </form>
      </div>
    </div>
  );
}
