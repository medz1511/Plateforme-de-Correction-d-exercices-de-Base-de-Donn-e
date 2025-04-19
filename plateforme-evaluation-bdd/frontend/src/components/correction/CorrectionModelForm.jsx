// src/components/correction/CorrectionModelForm.jsx

import React, { useState } from 'react';
import { X } from 'lucide-react';

/**
 * Formulaire pour uploader un modèle de correction (PDF)
 * props:
 * - exercise: l'exercice sélectionné (objet {id, exerciseTitle, ...})
 * - onSubmit: fonction({ pdfFile }) à appeler à la validation
 * - onClose: fonction() pour fermer le modal
 * - darkMode: bool
 */
const CorrectionModelForm = ({ exercise, onSubmit, onClose, darkMode }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = e => {
    const f = e.target.files[0];
    if (f) {
      if (f.type !== 'application/pdf') {
        setError('Veuillez sélectionner un fichier PDF.');
        return;
      }
      setError('');
      setFile(f);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!file) {
      setError('Aucun fichier sélectionné.');
      return;
    }
    onSubmit({ pdfFile: file });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>  
          {exercise
            ? `Mettre à jour le modèle pour : ${exercise.exerciseTitle}`
            : 'Sélectionner un modèle de correction'}
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className={`block w-full text-sm
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            ${darkMode ? 'file:bg-blue-600 file:text-white' : 'file:bg-blue-500 file:text-white'}
            hover:file:bg-blue-500
          `}
        />
        {file && (
          <p className="mt-1 text-sm text-gray-500">Fichier sélectionné : {file.name}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          Valider
        </button>
      </div>
    </form>
  );
};

export default CorrectionModelForm;
