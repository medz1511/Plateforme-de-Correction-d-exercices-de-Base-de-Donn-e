import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { BsMicrosoft } from "react-icons/bs";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Logique d'inscription ici
      console.log('Register data:', formData);
      setMessage("Inscription réussie !");
      
      // Redirection après inscription réussie
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      
    } catch (error) {
      setMessage(error.response?.data?.message || "Erreur lors de l'inscription");
      console.error("Erreur lors de l'inscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const registerWithGoogle = () => {
    console.log("Inscription avec Google");
  };

  const registerWithMicrosoft = () => {
    console.log("Inscription avec Microsoft");
  };

  const registerWithGitHub = () => {
    console.log("Inscription avec GitHub");
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-auto">
      <div className="flex-1 flex items-center justify-center py-4">
        <div className="max-w-xl w-full px-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Créer un compte</h1>
            <p className="mt-1 text-gray-400">Inscrivez-vous pour accéder à la plateforme</p>
          </div>

          <div className="mt-4">
            {message && (
              <div className={`mb-4 p-3 rounded ${message.includes('réussie') ? 'bg-green-800' : 'bg-red-800'}`}>
                {message}
              </div>
            )}
            
            <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
              <form onSubmit={handleSubmit}>
                {/* Disposition des champs nom et email sur une même ligne */}
                <div className="flex flex-wrap -mx-2 mb-3">
                  <div className="w-full md:w-1/2 px-2 mb-3 md:mb-0">
                    <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="fullName">
                      Nom complet
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      className="bg-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-2">
                    <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="bg-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="exemple@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Disposition des mots de passe sur une même ligne */}
                <div className="flex flex-wrap -mx-2 mb-3">
                  <div className="w-full md:w-1/2 px-2 mb-3 md:mb-0">
                    <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="password">
                      Mot de passe
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="bg-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      8 caractères minimum
                    </p>
                  </div>
                  <div className="w-full md:w-1/2 px-2">
                    <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="confirmPassword">
                      Confirmer
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="bg-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 rounded bg-gray-700"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                    J'accepte les <a href="#" className="text-indigo-400 hover:text-indigo-300">termes et conditions</a>
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm text-sm font-medium text-white disabled:bg-indigo-400"
                  >
                    {loading ? 'Inscription en cours...' : 'Créer mon compte'}
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center text-sm">
                <p className="text-gray-400">
                  Déjà un compte?{' '}
                  <a href="/" className="text-indigo-400 hover:text-indigo-300 font-medium">
                    Se connecter
                  </a>
                </p>
              </div>
            </div>

            {/* Boutons de connexion avec Google, Microsoft & GitHub comme dans login */}
            <div className="mt-6 flex flex-col items-center space-y-3">
              <button onClick={registerWithGoogle} className="w-full flex items-center justify-center py-3 px-4 bg-red-600 hover:bg-red-700 rounded-md text-white">
                <FcGoogle className="mr-2 text-xl" />
                S'inscrire avec Google
              </button>
              <button onClick={registerWithMicrosoft} className="w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white">
                <BsMicrosoft className="mr-2 text-xl" />
                S'inscrire avec Microsoft
              </button>
              <button onClick={registerWithGitHub} className="w-full flex items-center justify-center py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-md text-white">
                <BsGithub className="mr-2 text-xl" />
                S'inscrire avec GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;