import API from './api';  // ton axios.create({ baseURL: '/api' })

/**
 * Lancer la correction automatique pour un sujet
 * @param {number|string} sujetId
 */
export function correctSujet(sujetId) {
  return API.post(`/ia/correct/${sujetId}`);
}
