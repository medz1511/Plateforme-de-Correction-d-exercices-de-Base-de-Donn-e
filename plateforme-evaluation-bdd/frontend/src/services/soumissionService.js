// src/services/soumissionService.js
import API from './api';

export const fetchSoumissions = () =>
  API.get('/soumissions/allsubs');

export const fetchSoumissionsByEtu = (etudiantId) =>
  API.get('/soumissions', {
    params: etudiantId ? { etudiantId } : {}
  });

  export const createSoumission = ({ sujetId, file }) => {
    const form = new FormData();
    form.append('sujetId', sujetId);
    form.append('file', file);
    return API.post('/soumissions', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  };

export const updateSoumission = (id, data) =>
  API.put(`/soumissions/${id}/correction`, data);

// src/services/soumissionService.js

export const uploadSubmission = ({ sujetId, file }) => {
  const form = new FormData();
  form.append('sujetId', sujetId);

  // on récupère l'utilisateur stocké en localStorage
  const savedUser = JSON.parse(localStorage.getItem('user'));
  console.log(savedUser)
  if (savedUser && savedUser.id) {
    form.append('userId', savedUser.id);
  }

  form.append('file', file);
  return API.post('/soumissions', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};



export const corrigerSoumission = (id, file) => {
  const form = new FormData();
  form.append('file', file);
  return API.put(`/soumissions/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const deleteSoumission = id =>
  API.delete(`/soumissions/${id}`);

export const fetchSubmissionStats = () =>
  API.get('/soumissions/stats/sub').then(res => res.data);
