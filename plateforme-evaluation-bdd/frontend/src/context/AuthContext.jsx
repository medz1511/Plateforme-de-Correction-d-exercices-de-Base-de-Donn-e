import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";
import {
  register as apiRegister,
  login as apiLogin,
  logout as apiLogout,
  loginWithGoogle,
  loginWithGitHub,
  loginWithMicrosoft,
} from "../services/authService";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Au démarrage, on restore le token  user
  useEffect(() => {
    const token = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (token && u) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setCurrentUser(JSON.parse(u));
    }
    setLoading(false);
  }, []);

  // inscription (optionnel)
  const register = async (prenom, nom, email, password) => {
    const user = await apiRegister({ prenom, nom, email, password });
    return user;
  };

  // connexion
  const login = async (email, password) => {
    const { token, user: rawUser } = await apiLogin({ email, password });
// on force le rôle en minuscules
   const user = {
       ...rawUser,
       role: rawUser.role.toLowerCase()
     };
     
     // persist
     console.log(user)
     localStorage.setItem("token", token);
     localStorage.setItem("user", JSON.stringify(user));
     API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
     setCurrentUser(user);
     return user;
  };

  // déconnexion
  const logout = async () => {
    try {
      await apiLogout();
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete API.defaults.headers.common["Authorization"];
      setCurrentUser(null);
    }
  };

  // Oauth helpers
  const oauthGoogle = () => loginWithGoogle();
  const oauthGitHub = () => loginWithGitHub();
  const oauthMicrosoft = () => loginWithMicrosoft();

  const value = {
    currentUser,
    setCurrentUser,
    register,
    login,
    logout,
    oauthGoogle,
    oauthGitHub,
    oauthMicrosoft,
    isProf: currentUser?.role === "PROFESSEUR",
    isEtudiant: currentUser?.role === "ETUDIANT",
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
