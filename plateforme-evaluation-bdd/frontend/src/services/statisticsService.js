import API from './api';

/**
 * Récupère les performances des exercices
 */
export const fetchExercisePerformance = () =>
  API.get('/stats/exercises');

/**
 * Récupère la distribution des notes
 */
export const fetchGradeDistribution = () =>
  API.get('/stats/grades');

export const fetchOverview = () =>
  API.get('/stats/overview');