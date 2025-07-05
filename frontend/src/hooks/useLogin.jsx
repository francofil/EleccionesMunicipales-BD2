import { useState } from 'react';
import { loginUser } from '../services/authService';
import { saveToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


export function useLogin() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async ({ username, password }) => {
    setLoading(true);
    try {
      const { token } = await loginUser({ username, password });
      saveToken(token);

      const decoded = jwtDecode(token);
      const rol = decoded.rol;

      // Navegar según el rol
      if (rol === 'admin') {
        navigate('/homeAdmin');
      } else if (rol === 'presidente') {
        navigate('/homePresidente');
      } else {
        throw new Error('Rol desconocido');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
