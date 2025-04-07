import React, { useState, useEffect } from 'react';
import { Eye, Download, ThumbsUp, MessageCircle, Filter, Search, ArrowLeft } from 'lucide-react';
import Header from '../components/common/Header';
import { useTheme } from '../context/ThemeContext';

const ViewRapportEtudiant = () => {
  const { darkMode } = useTheme();
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Données simulées
  const exercices = [
    { id: 1, titre: "Introduction SQL - Requêtes simples", sujet: "Bases de données SQL", date: "12/03/2025", nbSoumissions: 28, nbEnAttente: 3 },
    { id: 2, titre: "Jointures et sous-requêtes", sujet: "Bases de données SQL", date: "15/03/2025", nbSoumissions: 25, nbEnAttente: 5 },
    { id: 3, titre: "Normalisation des bases de données", sujet: "Conception BDD", date: "18/03/2025", nbSoumissions: 23, nbEnAttente: 7 },
    { id: 4, titre: "Requêtes SQL avancées", sujet: "SQL avancé", date: "22/03/2025", nbSoumissions: 20, nbEnAttente: 10 }
  ];

  const rapportsEtudiants = [
    { id: 1, exerciceId: 1, etudiant: "Martin Dupont", email: "martin.dupont@edu.fr", dateRemise: "10/03/2025", statut: "Corrigé", note: "18/20", commentaires: 2 },
    { id: 2, exerciceId: 1, etudiant: "Sophie Martin", email: "sophie.martin@edu.fr", dateRemise: "11/03/2025", statut: "Corrigé", note: "16/20", commentaires: 3 },
    { id: 3, exerciceId: 1, etudiant: "Lucas Bernard", email: "lucas.bernard@edu.fr", dateRemise: "12/03/2025", statut: "En attente", note: "-", commentaires: 0 },
    { id: 4, exerciceId: 2, etudiant: "Emma Petit", email: "emma.petit@edu.fr", dateRemise: "14/03/2025", statut: "Corrigé", note: "17/20", commentaires: 1 },
    { id: 5, exerciceId: 2, etudiant: "Thomas Roux", email: "thomas.roux@edu.fr", dateRemise: "15/03/2025", statut: "En attente", note: "-", commentaires: 0 },
    { id: 6, exerciceId: 3, etudiant: "Camille Dubois", email: "camille.dubois@edu.fr", dateRemise: "17/03/2025", statut: "Corrigé", note: "19/20", commentaires: 2 },
    { id: 7, exerciceId: 1, etudiant: "Noah Moreau", email: "noah.moreau@edu.fr", dateRemise: "09/03/2025", statut: "En attente", note: "-", commentaires: 1 },
    { id: 8, exerciceId: 1, etudiant: "Léa Fournier", email: "lea.fournier@edu.fr", dateRemise: "10/03/2025", statut: "Corrigé", note: "15/20", commentaires: 2 },
    { id: 9, exerciceId: 2, etudiant: "Hugo Lambert", email: "hugo.lambert@edu.fr", dateRemise: "13/03/2025", statut: "Corrigé", note: "14/20", commentaires: 3 },
    { id: 10, exerciceId: 3, etudiant: "Chloé Rousseau", email: "chloe.rousseau@edu.fr", dateRemise: "16/03/2025", statut: "En attente", note: "-", commentaires: 0 }
  ];

  const getFilteredReports = () => {
    if (!selectedExerciseId) return [];
    
    return rapportsEtudiants
      .filter(rapport => rapport.exerciceId === selectedExerciseId)
      .filter(rapport => 
        rapport.etudiant.toLowerCase().includes(searchQuery.toLowerCase()) || 
        rapport.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter(rapport => statusFilter === 'all' || rapport.statut === statusFilter);
  };

  const handleExerciseSelect = (exerciseId) => {
    setSelectedExerciseId(exerciseId);
    setSearchQuery('');
    setStatusFilter('all');
  };

  const handleReportView = (reportId) => {
    console.log(`Voir le rapport ${reportId}`);
  };

  const handleReportDownload = (reportId) => {
    console.log(`Télécharger le rapport ${reportId}`);
  };

  const ExercisesList = () => (
    <div className={`rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`p-4 border-b ${darkMode ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
        <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Liste des exercices</h2>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Sélectionnez un exercice pour voir les rapports des étudiants
        </p>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher un exercice..."
            className={`w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'} border`}
          />
        </div>
        
        <div className="space-y-3">
          {exercices.map(exercice => (
            <div 
              key={exercice.id}
              className={`p-4 rounded-md cursor-pointer transition-colors ${darkMode ? 'bg-gray-750 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`}
              onClick={() => handleExerciseSelect(exercice.id)}
            >
              <h3 className={`font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{exercice.titre}</h3>
              <div className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sujet: {exercice.sujet}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date limite: {exercice.date}</div>
              
              <div className="flex items-center mt-2">
                <div className="mr-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'}`}>
                    {exercice.nbSoumissions} soumissions
                  </span>
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-100 text-yellow-800'}`}>
                    {exercice.nbEnAttente} en attente
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ReportsList = () => {
    const exercice = exercices.find(ex => ex.id === selectedExerciseId);
    const filteredReports = getFilteredReports();
    
    return (
      <div className={`flex-1 overflow-auto relative z-10 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header title={"Rapport des Etudiants"} />
        
        <div className={`rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'bg-gray-750 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div>
              <button 
                className={`mb-2 inline-flex items-center text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setSelectedExerciseId(null)}
              >
                <ArrowLeft size={16} className="mr-1" />
                Retour à la liste
              </button>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{exercice.titre}</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {exercice.sujet} - Date limite: {exercice.date}
              </p>
            </div>
            <div>
              <span className={`px-3 py-1 text-sm rounded-md mr-2 ${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'}`}>
                {exercice.nbSoumissions} soumissions
              </span>
              <button className={`px-3 py-1 rounded-md ${darkMode ? 'bg-green-600 hover:bg-green-500' : 'bg-green-500 hover:bg-green-600'} text-white`}>
                Télécharger tout
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search size={18} className={`absolute top-2.5 left-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Rechercher un étudiant..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <Filter size={18} className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="Corrigé">Corrigés</option>
                  <option value="En attente">En attente</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y">
                <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Étudiant
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Date de remise
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Statut
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Note
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Commentaires
                    </th>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'}`}>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((rapport) => (
                      <tr key={rapport.id} className={`${darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}`}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{rapport.etudiant}</div>
                          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{rapport.email}</div>
                        </td>
                        <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {rapport.dateRemise}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            rapport.statut === "Corrigé" 
                              ? darkMode ? "bg-green-900 text-green-100" : "bg-green-100 text-green-800"
                              : darkMode ? "bg-yellow-900 text-yellow-100" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {rapport.statut}
                          </span>
                        </td>
                        <td className={`px-4 py-3 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {rapport.note}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {rapport.commentaires > 0 ? (
                            <div className="flex items-center">
                              <MessageCircle size={16} className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} mr-1`} />
                              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{rapport.commentaires}</span>
                            </div>
                          ) : (
                            <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              className={`p-1.5 rounded-md ${darkMode ? 'text-blue-400 hover:text-blue-300 bg-blue-900 bg-opacity-30' : 'text-blue-500 hover:text-blue-600 bg-blue-100'}`}
                              onClick={() => handleReportView(rapport.id)}
                              title="Voir le rapport"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              className={`p-1.5 rounded-md ${darkMode ? 'text-green-400 hover:text-green-300 bg-green-900 bg-opacity-30' : 'text-green-500 hover:text-green-600 bg-green-100'}`}
                              onClick={() => handleReportDownload(rapport.id)}
                              title="Télécharger"
                            >
                              <Download size={16} />
                            </button>
                            {rapport.statut === "En attente" && (
                              <button 
                                className={`p-1.5 rounded-md ${darkMode ? 'text-purple-400 hover:text-purple-300 bg-purple-900 bg-opacity-30' : 'text-purple-500 hover:text-purple-600 bg-purple-100'}`}
                                title="Évaluer"
                              >
                                <ThumbsUp size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className={`px-4 py-8 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {searchQuery || statusFilter !== 'all' 
                          ? "Aucun rapport ne correspond aux critères de recherche" 
                          : "Aucun rapport n'a encore été soumis pour cet exercice"}
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
    <div className="w-full">
      {selectedExerciseId ? <ReportsList /> : <ExercisesList />}
    </div>
  );
};

export default ViewRapportEtudiant;