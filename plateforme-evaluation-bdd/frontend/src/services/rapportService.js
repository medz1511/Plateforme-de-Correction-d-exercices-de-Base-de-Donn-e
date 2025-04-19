// frontend/src/services/rapportService.js
import API from './api';

/**
 * Récupère les rapports (soumissions) pour un sujet donné
 * @param {number|string} sujetId
 * @returns {Promise<AxiosResponse<[]>>}
 */
export const fetchRapportsBySujet = (sujetId) =>
  API.get(`/sujets/${sujetId}/rapports`);
