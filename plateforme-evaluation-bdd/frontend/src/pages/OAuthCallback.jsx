// src/pages/OAuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get('token');
    const idParam = params.get('id');
    const id = idParam ? parseInt(idParam, 10) : null;
    const prenom = params.get('prenom');
    const nom    = params.get('nom');
    const email  = params.get('email');
    const role   = params.get('role');

    if (token && id && email && role) {
      // Stocke le token et l'utilisateur
      localStorage.setItem('token', token);
      const user = { id, prenom, nom, email, role: role.toLowerCase() };
      console.log(JSON.stringify(user));
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);

      // Redirige selon le rôle
      if (role.toLowerCase() === 'professeur') {
        navigate('/react-dashboard', { replace: true });
      } else {
        navigate('/dashboard-etudiant', { replace: true });
      }
    } else {
      // En cas d'erreur, renvoyer vers login
      navigate('/login', { replace: true });
    }
  }, [navigate, setCurrentUser]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-700">Connexion en cours...</p>
    </div>
  );
}
