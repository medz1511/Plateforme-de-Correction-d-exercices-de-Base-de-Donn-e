// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { BsGithub, BsMicrosoft } from "react-icons/bs";
import { useAuth } from '../context/AuthContext'; // ajuste le path si nécessaire

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, logout, oauthGoogle, oauthGitHub, oauthMicrosoft } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const user = await login(email, password);
      setMessage("Connexion réussie !");

      // redirection selon rôle
      if (user.role.toLowerCase() === 'professeur') {
        navigate('/react-dashboard');
      } else {
        navigate('/dashboard-etudiant');
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full px-6">
          <h1 className="text-3xl font-bold text-center">Connexion</h1>
          {message && (
            <div className={`mt-4 p-4 rounded ${message.includes('réussie') ? 'bg-green-800' : 'bg-red-800'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full mb-4 px-4 py-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <label className="block text-gray-300 mb-1">Mot de passe</label>
            <input
              type="password"
              className="w-full mb-6 px-4 py-2 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-medium disabled:bg-indigo-400"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>

            <div className="mt-4 text-sm text-center text-gray-400">
              <a href="#" className="hover:text-indigo-300">Mot de passe oublié ?</a>
            </div>
            <div className="mt-4 text-sm text-center text-gray-400">
              Pas encore de compte ? <a href="/register" className="text-indigo-400 hover:text-indigo-300">S'inscrire</a>
            </div>
          </form>

          {/* OAuth buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={oauthGoogle}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 rounded-md"
            >
              <FcGoogle size={20}/> Se connecter avec Google
            </button>
            <button
              onClick={oauthMicrosoft}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              <BsMicrosoft size={20}/> Se connecter avec Microsoft
            </button>
            <button
              onClick={oauthGitHub}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-gray-700 rounded-md"
            >
              <BsGithub size={20}/> Se connecter avec GitHub
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            <p>Utiliser un email professeur pour accéder au dashboard professeur</p>
          </div>
        </div>
      </div>
    </div>
  );
}
