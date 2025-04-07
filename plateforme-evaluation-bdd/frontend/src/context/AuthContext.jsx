// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupérer l'utilisateur depuis le localStorage au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Fonction de connexion
  async function login(email, password) {
    try {
      const response = await apiLogin({ email, password });
      
      // Stocker le token
      localStorage.setItem('token', response.data.token);
      
      // Détermine le rôle (cette logique doit s'adapter à votre backend)
      // Si votre API renvoie déjà le rôle, utilisez directement celui-ci
      const role = email.includes("prof") || email.includes("enseignant") ? "professeur" : "etudiant";
      
      const user = {
        email,
        role,
        name: response.data.name || email.split('@')[0],
        id: response.data.userId || response.data._id
      };
      
      // Stocker les informations utilisateur
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
  }

  // Fonction de déconnexion
  async function logout() {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentUser(null);
    }
  }

  const value = {
    currentUser,
    login,
    logout,
    isProf: currentUser?.role === 'professeur',
    isEtudiant: currentUser?.role === 'etudiant',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}