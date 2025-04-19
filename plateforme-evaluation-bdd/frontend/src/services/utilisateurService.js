// src/services/utilisateurService.js
import API from './api';

export const fetchUtilisateurs = () =>
  API.get('/utilisateurs');

export const fetchUtilisateur = id =>
  API.get(`/utilisateurs/${id}`);

export const createUtilisateur = data =>
  API.post('/utilisateurs', data);

export const updateUtilisateur = (id, data) =>
  API.put(`/utilisateurs/${id}`, data);

export const deleteUtilisateur = id =>
  API.delete(`/utilisateurs/${id}`);
