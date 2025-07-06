// src/hooks/useLoginVotante.js
import { useState } from "react";
import { loginVotante } from "../services/votantes/votantesService";
import { useNavigate } from "react-router-dom";
import { guardarVotanteEnStorage } from "../utils/loginVotanteUtils";

export function useLogin() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async ({ cedula, credencial }) => {
    setLoading(true);
    setError(null);

    try {
      const votante = await loginVotante({ cedula, credencial }); // ⚠️ Esperar la promesa

      guardarVotanteEnStorage(votante);
       localStorage.setItem('credencial', votante.credencial);

      navigate("/homeVotante");
    } catch (err) {
      setError("La combinación de cédula y credencial no es válida");
      err.error;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
