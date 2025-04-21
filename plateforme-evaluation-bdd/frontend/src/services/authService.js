import API from "./api";

// Enregistre un nouvel utilisateur
export const register = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data; // { prenom, nom, email, role }
};

// Authentification locale
export const login = async (credentials) => {
  const res = await API.post("/auth/login", credentials);
  return res.data; 
  // res.data === { token, user: { id, prenom, nom, email, role } }
};

// Déconnexion
export const logout = async () => {
  const res = await API.get("/auth/logout");
  return res.data;
};

// Oauth via redirection
export const loginWithGoogle = () => {
  window.location.href = `${API.defaults.baseURL}/auth/google`;
};
export const loginWithGitHub = () => {
  window.location.href = `${API.defaults.baseURL}/auth/github`;
};
export const loginWithMicrosoft = () => {
  window.location.href = `${API.defaults.baseURL}/auth/microsoft`;
};
