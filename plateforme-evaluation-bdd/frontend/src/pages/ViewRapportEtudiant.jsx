// src/pages/ViewRapportEtudiant.jsx

import React, { useState, useEffect } from 'react';
import {
  Eye,
  Download,
  ThumbsUp,
  MessageCircle,
  Filter,
  Search,
  ArrowLeft,
  X
} from 'lucide-react';
import Header from '../components/common/Header';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

import { fetchSujets } from '../services/sujetService';
import { fetchRapportsBySujet } from '../services/rapportService';
const API_BASE = import.meta.env.VITE_API_URL || '';

const ViewRapportEtudiant = () => {
  const { darkMode } = useTheme();

  const [sujets, setSujets] = useState([]);
  const [rapports, setRapports] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);

  // Stats
  const totalSubmissions = rapports.length;
  const totalPending = rapports.filter(r => r.statut === 'En attente').length;

  useEffect(() => {
    fetchSujets()
      .then(res => setSujets(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedExerciseId) return;
    fetchRapportsBySujet(selectedExerciseId)
      .then(res => {
        const data = res.data.map(r => ({
          id: r.id,
          exerciceId: r.sujet_id,
          etudiant: `${r.utilisateur.prenom} ${r.utilisateur.nom}`,
          email: r.utilisateur.email,
          dateRemise: new Date(r.date_soumission).toLocaleDateString('fr-FR'),
          statut: r.etat_upload === 'TERMINE' ? 'Corrigé' : 'En attente',
          note: r.note_automatique != null ? `${r.note_automatique}/20` : '-',
          commentaires: r.commentaire_ia ? 1 : 0
        }));
        setRapports(data);
      })
      .catch(console.error);
  }, [selectedExerciseId]);

  const filteredRapports = rapports
    .filter(r =>
      r.etudiant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(r => statusFilter === 'all' || r.statut === statusFilter);

  const openSubjectPdf = sujet => {
    setSelectedPdf({
      exerciseTitle: sujet.titre,
      pdfUrl: sujet.chemin_fichier_pdf
    });
    setShowPdfViewer(true);
    console.log(sujet.chemin_fichier_pdf);
  };

  const ExercisesList = () => (
    <div className={`rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`p-4 border-b ${darkMode ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Liste des sujets</h2>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Sélectionnez un sujet pour voir les rapports des étudiants
        </p>
      </div>
      <div className="p-4 space-y-3">
        {sujets.map(ex => (
          <div
            key={ex.id}
            onClick={() => setSelectedExerciseId(ex.id)}
            className={`p-4 rounded-md cursor-pointer transition-colors ${
              darkMode ? 'bg-gray-750 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <h3 className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{ex.titre}</h3>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Description : {ex.description}</div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Date limite: {new Date(ex.date_limite).toLocaleDateString('fr-FR')}
            </div>
            <div className="mt-2 flex space-x-2">
              {ex.chemin_fichier_pdf && (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); openSubjectPdf(ex); }}
                    className={`p-1 rounded-md ${darkMode ? 'bg-gray-900 hover:bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                    title="Voir le sujet"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      const link = document.createElement('a');
                      link.href = ex.chemin_fichier_pdf;
                      link.download = `${ex.titre}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className={`p-1 rounded-md ${darkMode ? 'bg-gray-900 hover:bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                    title="Télécharger le sujet"
                  >
                    <Download size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ReportsList = () => {
    const exercice = sujets.find(s => s.id === selectedExerciseId);
    return (
      <div className={`flex-1 overflow-auto relative z-10 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header title="Rapport des Étudiants" />
        <div className={`rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div>
              <button
                className={`inline-flex items-center text-sm mb-2 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setSelectedExerciseId(null)}
              >
                <ArrowLeft size={16} className="mr-1" /> Retour
              </button>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{exercice?.titre}</h2>
              <div className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {exercice?.sujet} — Date limite: {new Date(exercice?.date_limite).toLocaleDateString('fr-FR')}
              </div>
            </div>
            <div className="space-x-2">
              <span className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'}`}>
                {totalSubmissions} soumissions
              </span>
              <span className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-100 text-yellow-800'}`}>
                {totalPending} en attente
              </span>
              <button className={`px-3 py-1 rounded-md text-white ${darkMode ? 'bg-green-600 hover:bg-green-500' : 'bg-green-500 hover:bg-green-600'}`}>
                Télécharger tout
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex-1 min-w-[200px] relative">
                <Search size={18} className={`absolute top-2.5 left-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Rechercher un étudiant..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                />
              </div>
              <div className="flex items-center">
                <Filter size={18} className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className={`p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                >
                  <option value="all">Tous</option>
                  <option value="Corrigé">Corrigés</option>
                  <option value="En attente">En attente</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y">
                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Étudiant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Remise</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Statut</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Note</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Commentaires</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                  {filteredRapports.map(r => (
                    <tr key={r.id} className={`${darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>{r.etudiant}</div>
                        <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{r.email}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{r.dateRemise}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          r.statut === 'Corrigé'
                            ? (darkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800')
                            : (darkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-100 text-yellow-800')
                        }`}>{r.statut}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{r.note}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {r.commentaires > 0
                          ? <div className="flex items-center text-sm"><MessageCircle size={16} className="mr-1" />{r.commentaires}</div>
                          : <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>-</span>
                        }
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button onClick={() => handleReportView(r.id)} className="p-1.5 rounded-md"><Eye size={16} /></button>
                          <button onClick={() => handleReportDownload(r.id)} className="p-1.5 rounded-md"><Download size={16} /></button>
                          {r.statut === 'En attente' && <button className="p-1.5 rounded-md"><ThumbsUp size={16} /></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRapports.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-sm">
                        {searchQuery || statusFilter !== 'all'
                          ? "Aucun rapport ne correspond"
                          : "Aucune soumission pour cet exercice"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
      {selectedExerciseId ? <ReportsList /> : <ExercisesList />}
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

export default ViewRapportEtudiant;
