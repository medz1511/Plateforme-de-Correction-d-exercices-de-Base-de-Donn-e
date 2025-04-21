// frontend/src/services/correctionIAService.js
import api from './api';

/**
 * Appelle le backend pour corriger une soumission via l’IA
 * @param {number} submissionId
 * @returns {Promise}
 */
export const corrigerSoumission = submissionId =>
  api.post(`/api/soumissions/${submissionId}/corriger`);
