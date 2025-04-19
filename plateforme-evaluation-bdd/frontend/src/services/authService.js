// frontend/src/services/authService.js
import API from './api';

// Enregistre un nouvel utilisateur
export const register = data =>
  API.post('/auth/register', data);

// Authentification locale
export const login = credentials =>
  API.post('/auth/login', credentials);

// Déconnexion
export const logout = () =>
  API.get('/auth/logout');

// OAuth
export const loginWithGoogle = () =>
  window.location.href = `${API.defaults.baseURL.replace('/api','')}/auth/google`;

export const loginWithGitHub = () =>
  window.location.href = `${API.defaults.baseURL.replace('/api','')}/auth/github`;

export const loginWithMicrosoft = () =>
  window.location.href = `${API.defaults.baseURL.replace('/api','')}/auth/microsoft`;
