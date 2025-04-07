import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Cette page gère les redirections après authentification OAuth
const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUser } = useAuth();
  
  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Extraire le token de l'URL
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      
      if (!token) {
        console.error('Token non trouvé dans l\'URL');
        navigate('/');
        return;
      }
      
      try {
        // Stocker le token
        localStorage.setItem('token', token);
        
        // Récupérer les informations utilisateur
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Impossible de récupérer les informations utilisateur');
        }
        
        const userData = await response.json();
        setCurrentUser(userData);
        
        // Rediriger vers le dashboard approprié
        if (userData.role === 'professeur') {
          navigate('/react-dashboard');
        } else {
          navigate('/dahboard-etudiant');
        }
      } catch (error) {
        console.error('Erreur lors du traitement du callback OAuth:', error);
        navigate('/');
      }
    };
    
    handleOAuthCallback();
  }, [location, navigate, setCurrentUser]);
  
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="text-center text-white">
        <div className="inline-block animate-spin rounded-full border-4 border-t-4 border-gray-300 border-t-indigo-600 h-12 w-12 mb-4"></div>
        <h2 className="text-xl font-semibold">Connexion en cours...</h2>
        <p className="text-gray-400">Veuillez patienter pendant que nous finalisons votre connexion.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;