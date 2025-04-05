import React, { useState, useEffect } from 'react';
import { Eye, Download, MessageCircle, Filter, Search, ArrowLeft } from 'lucide-react';
import Header from '../components/common/Header';

const ViewRapportEtudiant = () => {
  // État pour stocker l'exercice sélectionné
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  // État pour la recherche d'étudiants
  const [searchQuery, setSearchQuery] = useState('');
  // État pour le filtre de statut
  const [statusFilter, setStatusFilter] = useState('all');

  // Données simulées - À remplacer par des appels API réels
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

  // Filtrer les rapports selon l'exercice sélectionné, la recherche et le statut
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
    // Réinitialiser les filtres
    setSearchQuery('');
    setStatusFilter('all');
  };

  const handleReportView = (reportId) => {
    console.log(`Voir le rapport ${reportId}`);
    // Ici, tu pourrais ouvrir une modal ou naviguer vers une page de détail
  };

  const handleReportDownload = (reportId) => {
    console.log(`Télécharger le rapport ${reportId}`);
    // Ici, tu déclencherais le téléchargement du rapport
  };

  // Liste des exercices
  const ExercisesList = () => (
    <div className="bg-gray-800 rounded-lg shadow-lg">
      <div className="p-4 bg-gray-750 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Liste des exercices</h2>
        <p className="text-sm text-gray-400">Sélectionnez un exercice pour voir les rapports des étudiants</p>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher un exercice..."
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
          />
        </div>
        
        <div className="space-y-3">
          {exercices.map(exercice => (
            <div 
              key={exercice.id}
              className="bg-gray-750 p-4 rounded-md cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => handleExerciseSelect(exercice.id)}
            >
              <h3 className="font-medium text-blue-400">{exercice.titre}</h3>
              <div className="text-sm text-gray-400 mt-1">Sujet: {exercice.sujet}</div>
              <div className="text-sm text-gray-400">Date limite: {exercice.date}</div>
              
              <div className="flex items-center mt-2">
                <div className="mr-4">
                  <span className="px-2 py-1 bg-blue-900 text-blue-100 text-xs rounded-full">
                    {exercice.nbSoumissions} soumissions
                  </span>
                </div>
                <div>
                  <span className="px-2 py-1 bg-yellow-900 text-yellow-100 text-xs rounded-full">
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

  // Détail des rapports pour un exercice sélectionné
  const ReportsList = () => {
    const exercice = exercices.find(ex => ex.id === selectedExerciseId);
    const filteredReports = getFilteredReports();
    
    return (
        <div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title={"Rapport des Etudiants"} />
      <div className="bg-gray-800 rounded-lg shadow-lg">
        <div className="p-4 bg-gray-750 border-b border-gray-700 flex justify-between items-center">
          <div>
            <button 
              className="mb-2 inline-flex items-center text-sm text-gray-400 hover:text-white"
              onClick={() => setSelectedExerciseId(null)}
            >
              <ArrowLeft size={16} className="mr-1" />
              Retour à la liste
            </button>
            <h2 className="text-lg font-semibold text-white">{exercice.titre}</h2>
            <p className="text-sm text-gray-400">
              {exercice.sujet} - Date limite: {exercice.date}
            </p>
          </div>
          <div>
            <span className="px-3 py-1 bg-blue-900 text-blue-100 text-sm rounded-md mr-2">
              {exercice.nbSoumissions} soumissions
            </span>
            <button className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded-md">
              Télécharger tout
            </button>
          </div>
        </div>
        
        <div className="p-4">
          {/* Filtres et recherche */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search size={18} className="absolute top-2.5 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un étudiant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
            </div>
            <div className="flex items-center">
              <Filter size={18} className="text-gray-400 mr-2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="all">Tous les statuts</option>
                <option value="Corrigé">Corrigés</option>
                <option value="En attente">En attente</option>
              </select>
            </div>
          </div>
          
          {/* Tableau des rapports */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Étudiant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date de remise
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Note
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Commentaires
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredReports.length > 0 ? (
                  filteredReports.map((rapport) => (
                    <tr key={rapport.id} className="hover:bg-gray-750">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{rapport.etudiant}</div>
                        <div className="text-xs text-gray-400">{rapport.email}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {rapport.dateRemise}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          rapport.statut === "Corrigé" 
                            ? "bg-green-900 text-green-100" 
                            : "bg-yellow-900 text-yellow-100"
                        }`}>
                          {rapport.statut}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {rapport.note}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {rapport.commentaires > 0 ? (
                          <div className="flex items-center">
                            <MessageCircle size={16} className="text-blue-400 mr-1" />
                            <span className="text-sm text-gray-300">{rapport.commentaires}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            className="p-1.5 text-blue-400 hover:text-blue-300 bg-blue-900 bg-opacity-30 rounded-md"
                            onClick={() => handleReportView(rapport.id)}
                            title="Voir le rapport"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="p-1.5 text-green-400 hover:text-green-300 bg-green-900 bg-opacity-30 rounded-md"
                            onClick={() => handleReportDownload(rapport.id)}
                            title="Télécharger"
                          >
                            <Download size={16} />
                          </button>
                          {/* Le bouton ThumbsUp/Like a été supprimé ici */}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
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