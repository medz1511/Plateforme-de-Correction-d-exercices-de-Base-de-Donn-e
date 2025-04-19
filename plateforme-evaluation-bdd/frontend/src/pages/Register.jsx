// src/pages/Register.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { register as apiRegister } from '../services/authService'; // utilise le service auth

export default function Register() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword } = form;

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit avoir au moins 8 caractères.');
      return;
    }
    if (!fullName.trim()) {
      setError('Veuillez entrer votre nom complet.');
      return;
    }

    try {
      // On sépare prénom / nom pour l’API
      const names = fullName.trim().split(' ');
      const prenom = names.shift();
      const nom = names.join(' ') || '';
      await apiRegister({ prenom, nom, email, password });
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Erreur lors de l’inscription.');
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="m-auto w-full max-w-md p-6">
        <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Créer un compte
        </h1>
        {error && (
          <div className="mb-4 text-sm text-red-500">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Nom complet
            </label>
            <input
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 rounded ${
                darkMode
                  ? 'bg-gray-700 text-white placeholder-gray-400'
                  : 'bg-white text-gray-800 placeholder-gray-500 border border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Jean Dupont"
            />
          </div>
          <div>
            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 rounded ${
                darkMode
                  ? 'bg-gray-700 text-white placeholder-gray-400'
                  : 'bg-white text-gray-800 placeholder-gray-500 border border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="exemple@domaine.com"
            />
          </div>
          <div>
            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Mot de passe
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 rounded ${
                darkMode
                  ? 'bg-gray-700 text-white placeholder-gray-400'
                  : 'bg-white text-gray-800 placeholder-gray-500 border border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="••••••••"
            />
            <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              8 caractères minimum
            </p>
          </div>
          <div>
            <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Confirmer mot de passe
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 rounded ${
                darkMode
                  ? 'bg-gray-700 text-white placeholder-gray-400'
                  : 'bg-white text-gray-800 placeholder-gray-500 border border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded transition-colors"
          >
            S’inscrire
          </button>
        </form>
        <p className={`mt-4 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Déjà inscrit ?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Se connecter
          </span>
        </p>
      </div>
    </div>
  );
}
