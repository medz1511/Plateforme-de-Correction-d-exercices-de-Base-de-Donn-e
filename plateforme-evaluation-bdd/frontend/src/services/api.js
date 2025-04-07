import axios from "axios";

//const API = axios.create({ baseURL: import.meta.env.VITE_API_URL, withCredentials: true });
// const API = axios.create({ 
//     baseURL: process.env.REACT_APP_API_URL, 
//     withCredentials: true 
//   });

// export const register = (userData) => API.post("/auth/register", userData);
// export const login = (userData) => API.post("/auth/login", userData);
// export const loginWithGoogle = () => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
// export const loginWithGitHub = () => window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
// export const loginWithMicrosoft = () => window.location.href = `${import.meta.env.VITE_API_URL}/auth/microsoft`;
// export const logout = () => API.get("/auth/logout");


// Mock API responses pour le développement
export const login = async ({ email, password }) => {
    return Promise.resolve({
      data: {
        token: "mock-token-12345",
        userId: "user123",
        name: email.split('@')[0]
      }
    });
  };
  
  export const logout = async () => {
    return Promise.resolve({ success: true });
  };
  
  export const loginWithGoogle = () => {
    console.log("Login avec Google");
    // Simulation d'authentification OAuth
  };
  
  export const loginWithGitHub = () => {
    console.log("Login avec GitHub");
    // Simulation d'authentification OAuth
  };
  
  export const loginWithMicrosoft = () => {
    console.log("Login avec Microsoft");
    // Simulation d'authentification OAuth
  };