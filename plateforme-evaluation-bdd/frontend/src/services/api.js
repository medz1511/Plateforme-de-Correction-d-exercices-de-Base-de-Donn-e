import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL, withCredentials: true });

export const register = (userData) => API.post("/auth/register", userData);
export const login = (userData) => API.post("/auth/login", userData);
export const loginWithGoogle = () => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
export const loginWithGitHub = () => window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
export const loginWithMicrosoft = () => window.location.href = `${import.meta.env.VITE_API_URL}/auth/microsoft`;
export const logout = () => API.get("/auth/logout");
