import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { BsMicrosoft } from "react-icons/bs";
import { useAuth } from '../context/AuthContext';
import { loginWithGoogle, loginWithGitHub, loginWithMicrosoft } from '../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = await login(email, password);
      setMessage("Connexion réussie !");
      
      // Rediriger vers le dashboard approprié selon le rôle
      if (user.role === 'professeur') {
        navigate('/react-dashboard');
      } else {
        navigate('/dahboard-etudiant');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Erreur de connexion");
      console.error("Erreur lors de la connexion:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full px-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Connexion</h1>
            <p className="mt-2 text-gray-400">Accédez à votre compte</p>
          </div>

          <div className="mt-8">
            {message && (
              <div className={`mb-4 p-4 rounded ${message.includes('réussie') ? 'bg-green-800' : 'bg-red-800'}`}>
                {message}
              </div>
            )}
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="bg-gray-700 rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="password">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="bg-gray-700 rounded w-full py-3 px-4 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center justify-between mb-6">
                  <a href="#" className="text-indigo-400 hover:text-indigo-300">
                    Mot de passe oublié?
                  </a>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm text-sm font-medium text-white disabled:bg-indigo-400"
                  >
                    {loading ? 'Connexion en cours...' : 'Se connecter'}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center text-sm">
                <p className="text-gray-400">
                  Pas encore de compte?{' '}
                  <a href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
                    S'inscrire
                  </a>
                </p>
              </div>
            </div>

            {/* Boutons de connexion avec Google, Microsoft & GitHub */}
            <div className="mt-6 flex flex-col items-center space-y-3">
              <button onClick={loginWithGoogle} className="w-full flex items-center justify-center py-3 px-4 bg-red-600 hover:bg-red-700 rounded-md text-white">
                <FcGoogle className="mr-2 text-xl" />
                Se connecter avec Google
              </button>
              <button onClick={loginWithMicrosoft} className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white">
                <BsMicrosoft className="mr-2 text-xl" />
                Se connecter avec Microsoft
              </button>
              <button onClick={loginWithGitHub} className="w-full flex items-center justify-center py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-md text-white">
                <BsGithub className="mr-2 text-xl" />
                Se connecter avec GitHub
              </button>
            </div>

            {/* Indication pour tester */}
            <div className="mt-4 text-center text-xs text-gray-400">
              <p>Utiliser un email contenant "prof" ou "enseignant" pour accéder au dashboard professeur</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;