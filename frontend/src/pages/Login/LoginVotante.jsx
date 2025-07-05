
import { useState } from 'react'
import './Login.css';
import { useLogin } from '../../hooks/useLoginVotante'

export default function Login() {
    const { login, loading, error } = useLogin();
    const [cedula, setCedula] = useState('');
    const [credencial, setCredencial] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        await login({ cedula, credencial });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <img
                    src="/escudo-uruguay.png"
                    alt="Escudo Nacional"
                    className="login-logo"
                />
                <h2>Bienvenido</h2>
                <p>Iniciá sesión ingresando tu <strong>credencial</strong> y <strong>cedula de identidad</strong>.</p>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="username">Credencial</label>
                        <input type="text" id="credencial" placeholder="Ingrese su credencial." value={credencial} onChange={(e) => setCredencial(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Cedula de identidad</label><p>Sin puntos ni guiones</p>
                        <input type="text" id="cedula" placeholder="Ingrese su ci." value={cedula} onChange={(e) => setCedula(e.target.value)} />
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>{loading ? 'Cargando...' : 'Iniciar sesión'}</button>
                    {error && <p className="error-message">La combinacion de cedula y credencial no coincide con ningun votante</p>}
                </form>
            </div>
        </div>
    );
}
