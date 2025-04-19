// src/pages/CorrectionModelsPage.jsx

import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { FileText, PlusCircle, Edit, CheckCircle, X, Eye, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import CorrectionModelForm from "../components/correction/CorrectionModelForm";
import { useTheme } from "../context/ThemeContext";
import {
  fetchSujets,
  uploadCorrectionModel,
  deleteSujetModel
} from "../services/sujetService";

// Base URL pour les fichiers (défini dans .env)
const API_BASE = import.meta.env.VITE_API_URL || '';


const CorrectionModelsPage = () => {
  const { darkMode, toggleTheme } = useTheme();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [models, setModels] = useState([]);

  // Récupère tous les sujets
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchSujets();
        const sujets = res.data;
        setModels(
          sujets.map(s => ({
            id: s.id,
            exerciseTitle: s.titre,
            status: s.chemin_fichier_correction_pdf ? 'Actif' : 'En attente',
            lastUpdate: s.updatedAt.split('T')[0],
            pdfUrl: s.chemin_fichier_correction_pdf
          }))
        );
      } catch (err) {
        console.error('Erreur chargement sujets :', err);
      }
    };
    load();
  }, []);

  // Statistiques
  const stats = [
    {
      name: 'Total des modèles',
      value: models.length.toString(),
      icon: FileText,
      color: darkMode ? '#8183f4' : '#6366F1',
      textColor: darkMode ? 'text-gray-100' : 'text-gray-900'
    },
    {
      name: 'Exercices Total',
      value: [...new Set(models.map(m => m.exerciseTitle))].length.toString(),
      icon: CheckCircle,
      color: darkMode ? '#34D399' : '#10B981',
      textColor: darkMode ? 'text-gray-100' : 'text-gray-900'
    },
    {
      name: 'Modèles actifs',
      value: models.filter(m => m.status === 'Actif').length.toString(),
      icon: CheckCircle,
      color: darkMode ? '#34D399' : '#10B981',
      textColor: darkMode ? 'text-gray-100' : 'text-gray-900'
    }
  ];

  // Handlers
  const handleAddNewModel = () => {
    setSelectedExercise(null);
    setShowAddModal(true);
  };

  const handleEditModel = model => {
    setSelectedExercise(model);
    setShowAddModal(true);
  };

  const handleDeleteModel = async model => {
    if (!window.confirm('Supprimer ce modèle ?')) return;
    try {
      await deleteSujetModel(model.id);
      setModels(models.filter(m => m.id !== model.id));
    } catch (err) {
      console.error('Erreur suppression :', err);
    }
  };

  const handleViewPdf = model => {
    setSelectedPdf(model);
    setShowPdfViewer(true);
  };

  const handleSubmitModel = async ({ pdfFile }) => {
    if (!selectedExercise) return;
    try {
      await uploadCorrectionModel(selectedExercise.id, pdfFile);
      // raffraîchir la liste
      const res = await fetchSujets();
      setModels(
        res.data.map(s => ({
          id: s.id,
          exerciseTitle: s.titre,
          status: s.chemin_fichier_correction_pdf ? 'Actif' : 'En attente',
          lastUpdate: s.updatedAt.split('T')[0],
          pdfUrl: s.chemin_fichier_correction_pdf
        }))
      );
    } catch (err) {
      console.error('Erreur upload modèle :', err);
    } finally {
      setShowAddModal(false);
      setSelectedExercise(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-6 w-full min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}
    >
      <Header title="Modèles de correction" darkMode={darkMode}>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-md ${darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'}`}
          >
            {darkMode ? 'Mode Clair ☀️' : 'Mode Sombre 🌙'}
          </button>
          <button
            onClick={handleAddNewModel}
            className="flex items-center gap-2 py-2 px-4 bg-blue-500 text-white rounded-lg"
          >
            <PlusCircle size={18} /> Ajouter un modèle
          </button>
        </div>
      </Header>

      {/* StatCards */}
      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            {...stat}
            darkMode={darkMode}
          />
        ))}
      </motion.div>

      {/* Tableau */}
      <div className={`mt-8 rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Modèles de correction par exercice
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="p-3 text-left">Exercice</th>
                <th className="p-3 text-left">Modèle</th>
                <th className="p-3 text-left">Statut</th>
                <th className="p-3 text-left">Dernière mise à jour</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {models.map(model => (
                <tr
                  key={model.id}
                  className={`border-b hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                >
                  <td className="p-3">{model.exerciseTitle}</td>
                  <td className="p-3">
                    {model.pdfUrl ? (
                      <button
                        onClick={() => handleViewPdf(model)}
                        className="text-blue-500 hover:underline"
                      >
                        Voir
                      </button>
                    ) : (
                      <span className="text-gray-500">Pas encore</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${model.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {model.status}
                    </span>
                  </td>
                  <td className="p-3">{model.lastUpdate}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleViewPdf(model)} className="p-2 text-blue-400 rounded-full">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleEditModel(model)} className="p-2 text-yellow-500 rounded-full">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDeleteModel(model)} className="p-2 text-red-500 rounded-full">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!models.length && (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-500">Aucun modèle disponible</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-xl p-6 w-full max-w-3xl transition-colors duration-300`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedExercise ? `Modifier : ${selectedExercise.exerciseTitle}` : 'Ajouter un modèle'}
              </h2>
              <button onClick={() => setShowAddModal(false)}><X size={24} /></button>
            </div>
            <CorrectionModelForm
              onClose={() => setShowAddModal(false)}
              onSubmit={handleSubmitModel}
              exercise={selectedExercise}
              darkMode={darkMode}
            />
          </div>
        </div>
      )}

      {/* Modal PDF Viewer */}
      {showPdfViewer && selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-xl p-6 w-full max-w-5xl h-4/5 transition-colors duration-300`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{selectedPdf.exerciseTitle}</h2>
              <button onClick={() => setShowPdfViewer(false)}><X size={24} /></button>
            </div>
            <iframe
              src={`${API_BASE}${selectedPdf.pdfUrl}`}
              className="w-full h-full rounded"
              title={selectedPdf.exerciseTitle}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CorrectionModelsPage;
