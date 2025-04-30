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
import axiosInstance from '../services/api';

const ViewRapportEtudiant = () => {
  const { darkMode } = useTheme();

  const [sujets, setSujets] = useState([]);
  const [rapports, setRapports] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [loading, setLoading] = useState(false);

  const totalSubmissions = rapports.length;
  const totalPending = rapports.filter(r => r.statut === 'En attente').length;

  useEffect(() => {
    fetchSujets()
      .then(res => setSujets(res.data))
      .catch(err => {
        console.error("Erreur lors du chargement des sujets:", err);
        alert("Impossible de charger la liste des sujets.");
      });
  }, []);

  useEffect(() => {
    if (!selectedExerciseId) return;
    setLoading(true);
    fetchRapportsBySujet(selectedExerciseId)
      .then(res => {
        const data = res.data.map(r => ({
          id: r.id,
          sujetId: r.sujet_id,
          etudiant: `${r.utilisateur.prenom} ${r.utilisateur.nom}`,
          email: r.utilisateur.email,
          dateRemise: new Date(r.date_soumission).toLocaleDateString('fr-FR'),
          statut: r.etat === 'CORRIGE' ? 'Corrigé' : 'En attente',
          note: r.note_automatique != null ? `${r.note_automatique}/20` : '-',
          commentaires: r.commentaire_ia ? 1 : 0,
          chemin_fichier_pdf: r.chemin_fichier_pdf
        }));
        setRapports(data);
      })
      .catch(err => {
        console.error("Erreur lors du chargement des rapports:", err);
        alert("Impossible de charger les rapports pour ce sujet.");
      })
      .finally(() => setLoading(false));
  }, [selectedExerciseId]);

  const filteredRapports = rapports
    .filter(r =>
      r.etudiant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(r => statusFilter === 'all' || r.statut === statusFilter);

  // Fonction simplifiée pour obtenir l'URL signée ou télécharger un PDF
  const handlePdfAction = async (path, isDownload = false, customFilename = null) => {
    if (!path) {
      alert("Le fichier PDF n'est pas disponible.");
      return null;
    }
    
    setLoading(true);
    
    try {
      // Nettoyage du chemin si nécessaire
      const cleanPath = path.replace(/^\/?uploads\//, '');
      
      // Endpoint différent selon l'action (voir ou télécharger)
      const endpoint = isDownload ? '/soumissions/download' : '/soumissions/signed-url';
      
      const response = await axiosInstance.get(endpoint, {
        params: { path: cleanPath },
        responseType: isDownload ? 'blob' : 'json'
      });
      
      // Pour le téléchargement
      if (isDownload) {
        const pdfBlob = response.data;
        const blobUrl = window.URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
        const filename = customFilename || `Rapport_${new Date().toISOString().split('T')[0]}.pdf`;
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        
        // Nettoyage après téléchargement
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl);
        }, 300); // Augmentation du délai pour assurer le téléchargement
        
        return true;
      } else {
        // Pour la visualisation, retourne l'URL signée
        return response.data.url;
      }
    } catch (error) {
      console.error(`Erreur lors de ${isDownload ? 'téléchargement' : 'visualisation'} du PDF:`, error);
      alert(`Erreur lors de ${isDownload ? 'téléchargement' : 'visualisation'} du PDF. Veuillez réessayer.`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Visualisation d'un rapport
  const handleViewSubmission = async (rapportId) => {
    const rapport = rapports.find(r => r.id === rapportId);
    if (!rapport?.chemin_fichier_pdf) {
      alert("Le fichier PDF n'est pas disponible.");
      return;
    }

    try {
      const pdfUrl = await handlePdfAction(rapport.chemin_fichier_pdf, false);
      if (pdfUrl) {
        setSelectedPdf({
          exerciseTitle: `Soumission de ${rapport.etudiant}`,
          pdfUrl: pdfUrl
        });
        setShowPdfViewer(true);
      }
    } catch (error) {
      console.error("Erreur lors de l'affichage du PDF:", error);
    }
  };

  // Téléchargement d'un rapport
  const handleReportDownload = async (rapportId) => {
    const rapport = rapports.find(r => r.id === rapportId);
    if (!rapport?.chemin_fichier_pdf) {
      alert("Le fichier PDF n'est pas disponible.");
      return;
    }

    try {
      const filename = `Rapport_${rapport.etudiant.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      await handlePdfAction(rapport.chemin_fichier_pdf, true, filename);
    } catch (error) {
      console.error("Erreur lors du téléchargement du PDF:", error);
    }
  };

  // Visualisation d'un sujet
  const openSubjectPdf = async (sujet) => {
    if (!sujet?.chemin_fichier_pdf) {
      alert("Le fichier PDF du sujet n'est pas disponible.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(`/sujets/${sujet.id}/signed-url`);
      setSelectedPdf({
        exerciseTitle: sujet.titre,
        pdfUrl: response.data.url
      });
      setShowPdfViewer(true);
    } catch (error) {
      console.error("Erreur affichage sujet :", error);
      alert("Impossible d'afficher le sujet. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Téléchargement d'un sujet
  const handleDownloadSubject = async (sujet) => {
    if (!sujet?.chemin_fichier_pdf) {
      alert("Le fichier PDF du sujet n'est pas disponible.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(`/sujets/${sujet.id}/download`, {
        responseType: 'blob'
      });
      
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const filename = `${sujet.titre.replace(/\s+/g, '_')}.pdf`;
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Nettoyage après téléchargement
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 300);
    } catch (err) {
      console.error("Erreur lors du téléchargement du sujet:", err);
      alert("Erreur lors du téléchargement du sujet. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Téléchargement de tous les rapports
  const handleDownloadAll = async () => {
    if (rapports.length === 0) {
      alert("Aucun rapport disponible à télécharger.");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.get(`/rapports/download-all/${selectedExerciseId}`, {
        responseType: 'blob'
      });
      
      const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }));
      const sujet = sujets.find(s => s.id === selectedExerciseId);
      const filename = `Rapports_${sujet ? sujet.titre.replace(/\s+/g, '_') : 'Tous'}_${new Date().toISOString().split('T')[0]}.zip`;
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Nettoyage après téléchargement
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 500); // Délai plus long pour les fichiers volumineux
    } catch (err) {
      console.error("Erreur lors du téléchargement de tous les rapports:", err);
      alert('Impossible de télécharger tous les rapports. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
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
        {sujets.length === 0 ? (
          <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Chargement des sujets...
          </div>
        ) : (
          sujets.map(ex => (
            <div
              key={ex.id}
              onClick={() => setSelectedExerciseId(ex.id)}
              className={`p-4 rounded-md cursor-pointer transition-colors ${darkMode ? 'bg-gray-750 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`}
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
                        handleDownloadSubject(ex);
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
          ))
        )}
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
                {exercice?.description} — Date limite: {exercice?.date_limite ? new Date(exercice.date_limite).toLocaleDateString('fr-FR') : 'N/A'}
              </div>
            </div>
            <div className="space-x-2">
              <span className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'}`}>
                {totalSubmissions} soumissions
              </span>
              <span className={`px-3 py-1 rounded-md text-sm ${darkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-100 text-yellow-800'}`}>
                {totalPending} en attente
              </span>
              {rapports.length > 0 && (
                <button
                  onClick={handleDownloadAll}
                  disabled={loading}
                  className={`px-3 py-1 rounded-md text-white ${
                    loading 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : darkMode 
                        ? 'bg-green-600 hover:bg-green-500' 
                        : 'bg-green-500 hover:bg-green-600'
                  }`}>
                  {loading ? 'Chargement...' : 'Télécharger tout'}
                </button>
              )}
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
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-sm">
                        Chargement des rapports...
                      </td>
                    </tr>
                  ) : filteredRapports.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-sm">
                        {searchQuery || statusFilter !== 'all'
                          ? "Aucun rapport ne correspond"
                          : "Aucune soumission pour cet exercice"}
                      </td>
                    </tr>
                  ) : (
                    filteredRapports.map(r => (
                      <tr key={r.id} className={`${darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>{r.etudiant}</div>
                          <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{r.email}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">{r.dateRemise}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${r.statut === 'Corrigé'
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
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewSubmission(r.id);
                              }}
                              disabled={loading}
                              className={`p-1 rounded-md ${
                                loading 
                                  ? 'opacity-50 cursor-not-allowed' 
                                  : darkMode 
                                    ? 'bg-gray-900 hover:bg-gray-800 text-white' 
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                              }`}
                              title="Voir la soumission"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReportDownload(r.id);
                              }}
                              disabled={loading}
                              className={`p-1 rounded-md ${
                                loading 
                                  ? 'opacity-50 cursor-not-allowed' 
                                  : darkMode 
                                    ? 'bg-gray-900 hover:bg-gray-800 text-white' 
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                              }`}
                              title="Télécharger le rapport"
                            >
                              <Download size={16} />
                            </button>

                            {r.statut === 'En attente' && (
                              <button
                                className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                                onClick={() => {
                                  // Implémenter la validation du rapport ici
                                  alert("Fonctionnalité à implémenter");
                                }}
                              >
                                <ThumbsUp size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
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
      
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-6 rounded-lg shadow-lg`}>
            <p className="text-center">Chargement en cours...</p>
          </div>
        </div>
      )}

      {showPdfViewer && selectedPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-xl p-6 w-full max-w-5xl h-5/6 flex flex-col`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{selectedPdf.exerciseTitle}</h2>
              <button 
                onClick={() => setShowPdfViewer(false)}
                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 bg-gray-100 rounded-lg">
              <iframe 
                src={`${selectedPdf.pdfUrl}#toolbar=1&view=FitH`} 
                className="w-full h-full rounded-lg border-0"
                title={selectedPdf.exerciseTitle}
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ViewRapportEtudiant;