// src/components/AddExerciseForm.jsx

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import { useTheme } from '../context/ThemeContext';
import { createSujet } from '../services/sujetService';

const AddExerciseForm = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [exerciseData, setExerciseData] = useState({
    titre: '',
    sujet: '',
    description: '',
    dateLimite: ''
  });
  const [error, setError] = useState('');
  const savedUser = JSON.parse(localStorage.getItem('user'));
console.log(savedUser.id);
console.log(savedUser);

  const handleChange = e => {
    const { name, value } = e.target;
    setExerciseData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const referenceFile = fileInputRef.current.files[0] || null;
      await createSujet({
        titre: exerciseData.titre,
        description: exerciseData.description,
        dateLimite: exerciseData.dateLimite,
        referenceFile,
        professeurId:savedUser.id
      });
      navigate('/sujets');
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la création du TD.');
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className={`flex-1 overflow-auto relative z-10 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <Header title="Ajouter TD" />
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md max-w-3xl mx-auto my-6`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Ajouter un nouvel exercice
        </h2>
        {error && (
          <div className="mb-4 text-red-500">
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Titre de l'exercice
            </label>
            <input 
              type="text" 
              name="titre"
              value={exerciseData.titre}
              onChange={handleChange}
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
              placeholder="Ex: Requêtes SQL avancées"
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Sujet
            </label>
            <select 
              name="sujet"
              value={exerciseData.sujet}
              onChange={handleChange}
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
            >
              <option>Bases de données SQL</option>
              <option>Conception BDD</option>
              <option>Administration BDD</option>
              <option>Modélisation de données</option>
              <option>SQL avancé</option>
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Description
            </label>
            <textarea
              name="description"
              value={exerciseData.description}
              onChange={handleChange}
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
              rows="4"
              placeholder="Instructions détaillées de l'exercice..."
              required
            ></textarea>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Date limite
            </label>
            <input 
              type="date" 
              name="dateLimite"
              value={exerciseData.dateLimite}
              onChange={handleChange}
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Fichier de référence (optionnel)
            </label>
            <div className="mt-1 flex items-center">
              <input 
                type="file" 
                ref={fileInputRef}
                className={`block w-full text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  ${darkMode ? 'file:bg-blue-600' : 'file:bg-blue-500'} file:text-white
                  hover:file:bg-blue-500`}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <button 
              type="button"
              className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'} text-white`}
              onClick={handleCancel}
            >
              Annuler
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExerciseForm;
