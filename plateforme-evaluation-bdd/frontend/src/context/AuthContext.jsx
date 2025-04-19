// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../services/authService';

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
      // const role = email.includes("prof") || email.includes("enseignant") ? "professeur" : "etudiant";
      

      const user = {
        email: response.data.user.email,
        role: response.data.user.role.toLowerCase(),
        name: response.data.user.prenom + ' ' + response.data.user.nom,
        id: response.data.user.id
      };

      console.log(user.role);
      
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