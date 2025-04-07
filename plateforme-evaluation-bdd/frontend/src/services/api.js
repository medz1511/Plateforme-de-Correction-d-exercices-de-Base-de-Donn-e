// import axios from "axios";

// //const API = axios.create({ baseURL: import.meta.env.VITE_API_URL, withCredentials: true });
// // const API = axios.create({ 
// //     baseURL: process.env.REACT_APP_API_URL, 
// //     withCredentials: true 
// //   });

// // export const register = (userData) => API.post("/auth/register", userData);
// // export const login = (userData) => API.post("/auth/login", userData);
// // export const loginWithGoogle = () => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
// // export const loginWithGitHub = () => window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
// // export const loginWithMicrosoft = () => window.location.href = `${import.meta.env.VITE_API_URL}/auth/microsoft`;
// // export const logout = () => API.get("/auth/logout");


// // Mock API responses pour le développement
// export const login = async ({ email, password }) => {
//     return Promise.resolve({
//       data: {
//         token: "mock-token-12345",
//         userId: "user123",
//         name: email.split('@')[0]
//       }
//     });
//   };
  
//   export const logout = async () => {
//     return Promise.resolve({ success: true });
//   };
  
//   export const loginWithGoogle = () => {
//     console.log("Login avec Google");
//     // Simulation d'authentification OAuth
//   };
  
//   export const loginWithGitHub = () => {
//     console.log("Login avec GitHub");
//     // Simulation d'authentification OAuth
//   };
  
//   export const loginWithMicrosoft = () => {
//     console.log("Login avec Microsoft");
//     // Simulation d'authentification OAuth
//   };


import axios from "axios";

// Création d'une instance axios avec la configuration de base
const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true // Pour gérer les cookies de session
});

// Ajout d'un intercepteur pour inclure le token JWT dans les headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Services d'authentification
export const register = (userData) => API.post("/auth/register", userData);
export const login = (userData) => API.post("/auth/login", userData);
export const logout = () => API.get("/auth/logout");
export const getCurrentUser = () => API.get("/auth/me");

// Connexion avec providers OAuth
export const loginWithGoogle = () => window.location.href = `${API.defaults.baseURL}/auth/google`;
export const loginWithGitHub = () => window.location.href = `${API.defaults.baseURL}/auth/github`;
export const loginWithMicrosoft = () => window.location.href = `${API.defaults.baseURL}/auth/microsoft`;

// Services pour les exercices
export const fetchExercises = () => API.get("/exercises");
export const fetchExerciseById = (id) => API.get(`/exercises/${id}`);
export const createExercise = (exerciseData) => API.post("/exercises", exerciseData);
export const updateExercise = (id, exerciseData) => API.put(`/exercises/${id}`, exerciseData);
export const deleteExercise = (id) => API.delete(`/exercises/${id}`);

// Services pour les soumissions
export const submitExercise = (exerciseId, submissionData) => API.post(`/exercises/${exerciseId}/submissions`, submissionData);
export const fetchSubmissions = (exerciseId) => API.get(`/exercises/${exerciseId}/submissions`);
export const fetchStudentSubmissions = () => API.get("/submissions/student");

// Services pour les corrections
export const fetchCorrections = () => API.get("/corrections");
export const fetchCorrectionById = (id) => API.get(`/corrections/${id}`);
export const requestCorrection = (submissionId) => API.post(`/corrections/request/${submissionId}`);

// Services pour les notes
export const fetchStudentGrades = () => API.get("/grades/student");
export const fetchAllGrades = () => API.get("/grades");
export const updateGrade = (submissionId, gradeData) => API.put(`/grades/${submissionId}`, gradeData);

// Service pour les modèles de correction
export const fetchCorrectionModels = () => API.get("/correction-models");
export const createCorrectionModel = (modelData) => API.post("/correction-models", modelData);
export const updateCorrectionModel = (id, modelData) => API.put(`/correction-models/${id}`, modelData);