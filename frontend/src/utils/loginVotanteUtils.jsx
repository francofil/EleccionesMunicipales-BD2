// src/utils/loginVotanteUtils.js

const STORAGE_KEY = 'votanteData';

export const guardarVotanteEnStorage = (votante) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(votante));
};

export const obtenerVotanteDeStorage = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
};

export const eliminarVotanteDeStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};