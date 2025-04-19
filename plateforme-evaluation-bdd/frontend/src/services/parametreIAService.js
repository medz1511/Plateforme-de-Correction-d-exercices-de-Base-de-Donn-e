// src/services/parametreIAService.js
import API from './api';

export const fetchParametresIA = () =>
  API.get('/parametre_ia');

export const updateParametreIA = (nom, valeur) =>
  API.put('/parametre_ia', { nom, valeur });
