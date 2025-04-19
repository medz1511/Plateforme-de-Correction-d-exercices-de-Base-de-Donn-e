// frontend/src/services/sujetService.js
import API from './api';

/**
 * Récupère tous les sujets
 * @returns {Promise<AxiosResponse<Sujet[]>>}
 */
export const fetchSujets = () => {
  return API.get('/sujets');
};

/**
 * Upload du modèle de correction pour un sujet
 * @param {number} sujetId
 * @param {File} modelFile  // objet File du <input type="file">
 * @returns {Promise<AxiosResponse<Sujet>>}
 */
export const uploadCorrectionModel = (sujetId, modelFile) => {
  const form = new FormData();
  form.append('modelFile', modelFile);
  return API.post(`/sujets/${sujetId}/correction-model`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

/**
 * Supprime un sujet (et son modèle)
 * @param {number} sujetId
 * @returns {Promise<AxiosResponse>}
 */
export const deleteSujetModel = (sujetId) => {
  return API.delete(`/sujets/${sujetId}`);
};

/**
 * (Optionnel) Récupère un sujet par son ID
 * @param {number} sujetId
 * @returns {Promise<AxiosResponse<Sujet>>}
 */
export const fetchSujetById = (sujetId) => {
  return API.get(`/sujets/${sujetId}`);
};

export const fetchSujetSubmission = sujetId =>
  API.get(`/sujets/${sujetId}/soumission`);

/**
 * (Optionnel) Met à jour les métadonnées d’un sujet
 * @param {number} sujetId
 * @param {Object} data      // { titre, description, dateLimite, ... }
 * @returns {Promise<AxiosResponse<[affectedCount]>>}
 */
export const updateSujet = (sujetId, data) => {
  return API.put(`/sujets/${sujetId}`, data);
};

/**
 * (Optionnel) Crée un nouveau sujet
 * @param {Object} data      // { titre, description, dateLimite, referenceFile, professeurId }
 * @returns {Promise<AxiosResponse<Sujet>>}
 */
export const createSujet = (data) => {
  const form = new FormData();
  form.append('titre', data.titre);
  form.append('description', data.description);
  form.append('dateLimite', data.dateLimite);
  form.append('professeurId', data.professeurId);
  if (data.referenceFile) {
    form.append('referenceFile', data.referenceFile);
  }
  return API.post('/sujets', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const fetchSoumissionsBySujet = sujetId =>
  API.get(`/sujets/${sujetId}/soumissions`);
