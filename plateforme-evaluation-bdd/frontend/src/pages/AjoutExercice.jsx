import React, { useState } from 'react';
import Header from '../components/common/Header';

const AddExerciseForm = ({ onCancel, onSubmit }) => {
  const [exerciseData, setExerciseData] = useState({
    titre: '',
    sujet: 'Bases de données SQL',
    description: '',
    dateLimite: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExerciseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(exerciseData);
  };

  return (
    <div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title={"Ajouter TD"} />
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">Ajouter un nouvel exercice</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-300">Titre de l'exercice</label>
          <input 
            type="text" 
            name="titre"
            value={exerciseData.titre}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-600 bg-gray-700 rounded-md shadow-sm p-2 text-white"
            placeholder="Ex: Requêtes SQL avancées"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Sujet</label>
          <select 
            name="sujet"
            value={exerciseData.sujet}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-600 bg-gray-700 rounded-md shadow-sm p-2 text-white"
          >
            <option>Bases de données SQL</option>
            <option>Conception BDD</option>
            <option>Administration BDD</option>
            <option>Modélisation de données</option>
            <option>SQL avancé</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Description</label>
          <textarea
            name="description"
            value={exerciseData.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-600 bg-gray-700 rounded-md shadow-sm p-2 text-white"
            rows="4"
            placeholder="Instructions détaillées de l'exercice..."
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Date limite</label>
          <input 
            type="date" 
            name="dateLimite"
            value={exerciseData.dateLimite}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-600 bg-gray-700 rounded-md shadow-sm p-2 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Fichier de référence (optionnel)</label>
          <div className="mt-1 flex items-center">
            <input 
              type="file" 
              className="block w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-2">
          <button 
            type="button"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
            onClick={onCancel}
          >
            Annuler
          </button>
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
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