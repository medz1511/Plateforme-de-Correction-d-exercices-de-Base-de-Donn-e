import { useState, useEffect } from "react";
import { Eye, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

const Modal = ({ isOpen, onClose, children, darkMode }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
    >
      <div className={`rounded-lg max-w-2xl w-full mx-4 p-6 overflow-auto max-h-screen my-4 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {children}
      </div>
    </div>,
    document.body
  );
};

const SubmissionsTable = ({ submissions, loading, onGradeAdjust }) => {
  const { darkMode } = useTheme();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [adjustedGrade, setAdjustedGrade] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleReviewClick = (submission) => {
    setSelectedSubmission(submission);
    setAdjustedGrade(submission.professorScore || submission.aiScore);
    setFeedback(submission.feedback || "");
    setIsEditing(submission.status !== "reviewed");
    setIsModalOpen(true);
  };

  const handleSaveGrade = () => {
    onGradeAdjust(selectedSubmission.id, adjustedGrade, feedback);
    setIsModalOpen(false);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Classes dynamiques
  const containerClasses = `rounded-lg shadow-xl overflow-hidden transition-colors duration-300 ${
    darkMode ? 'bg-gray-800' : 'bg-white'
  }`;
  const headerClasses = `px-6 py-4 border-b ${
    darkMode ? 'border-gray-700' : 'border-gray-200'
  }`;
  const titleClasses = `text-xl font-semibold ${
    darkMode ? 'text-white' : 'text-gray-800'
  }`;
  const tableHeaderClasses = `text-left text-xs font-medium uppercase tracking-wider ${
    darkMode ? 'text-gray-300' : 'text-gray-600'
  }`;
  const tableRowClasses = `divide-y ${
    darkMode ? 'divide-gray-700 hover:bg-gray-700' : 'divide-gray-200 hover:bg-gray-50'
  }`;
  const studentNameClasses = `text-sm font-medium ${
    darkMode ? 'text-white' : 'text-gray-900'
  }`;
  const textClasses = `text-sm ${
    darkMode ? 'text-gray-300' : 'text-gray-600'
  }`;
  const statusClasses = (status) => `px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
    status === "reviewed"
      ? darkMode ? "bg-green-800 text-green-100" : "bg-green-100 text-green-800"
      : darkMode ? "bg-yellow-800 text-yellow-100" : "bg-yellow-100 text-yellow-800"
  }`;
  const inputClasses = `px-3 py-2 rounded w-full ${
    darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
  }`;

  return (
    <motion.div
      className={containerClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className={headerClasses}>
        <h2 className={titleClasses}>Soumissions récentes</h2>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-10">
            <div className={`inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${
              darkMode ? 'border-blue-500' : 'border-blue-600'
            } mb-4`}></div>
            <p className={textClasses}>Chargement des soumissions...</p>
          </div>
        ) : (
          <table className="min-w-full divide-y">
            <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
              <tr>
                <th className={`px-6 py-3 ${tableHeaderClasses}`}>Élève</th>
                <th className={`px-6 py-3 ${tableHeaderClasses}`}>Exercice</th>
                <th className={`px-6 py-3 ${tableHeaderClasses}`}>Date de soumission</th>
                <th className={`px-6 py-3 ${tableHeaderClasses}`}>Note IA</th>
                <th className={`px-6 py-3 ${tableHeaderClasses}`}>Note finale</th>
                <th className={`px-6 py-3 ${tableHeaderClasses}`}>Statut</th>
                <th className={`px-6 py-3 ${tableHeaderClasses}`}>Actions</th>
              </tr>
            </thead>
            <tbody className={darkMode ? 'bg-gray-800' : 'bg-white'}>
              {submissions.map((submission) => (
                <tr key={submission.id} className={tableRowClasses}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={studentNameClasses}>
                      {submission.studentName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={textClasses}>
                      {submission.exerciseName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={textClasses}>
                      {new Date(submission.submittedAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={textClasses}>
                      {submission.aiScore}/20
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {submission.professorScore ? (
                      <span className="text-green-400">
                        {submission.professorScore}/20
                      </span>
                    ) : (
                      <span className={textClasses}>En attente</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={statusClasses(submission.status)}>
                      {submission.status === "reviewed" ? "Corrigé" : "En attente"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleReviewClick(submission)}
                      className={`${
                        darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'
                      } mr-4`}
                      title={submission.status === "reviewed" ? "Voir/Modifier" : "Corriger"}
                    >
                      {submission.status === "reviewed" ? <Eye size={18} /> : <Edit2 size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen && selectedSubmission !== null} 
        onClose={() => setIsModalOpen(false)}
        darkMode={darkMode}
      >
        {selectedSubmission && (
          <>
            <h3 className={`text-xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {!isEditing && selectedSubmission.status === "reviewed"
                ? "Détails de la soumission"
                : "Correction"}
            </h3>

            <div className="mb-4">
              <p className={`mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-medium">Élève:</span> {selectedSubmission.studentName}
              </p>
              <p className={`mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-medium">Exercice:</span> {selectedSubmission.exerciseName}
              </p>
              <p className={`mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="font-medium">Soumis le:</span> {new Date(selectedSubmission.submittedAt).toLocaleString()}
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Note IA:
                </p>
                <p className="text-yellow-400 font-bold">
                  {selectedSubmission.aiScore}/20
                </p>
              </div>

              <div className={`p-4 rounded-lg mb-4 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <p className={`text-sm italic ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Analyse automatique...
                </p>
              </div>

              <div className="mt-4">
                <label className={`block font-medium mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Note ajustée:
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={adjustedGrade}
                  onChange={(e) => setAdjustedGrade(parseFloat(e.target.value))}
                  className={inputClasses}
                  disabled={!isEditing}
                />
              </div>

              <div className="mt-4">
                <label className={`block font-medium mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Commentaires:
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className={`${inputClasses} h-32`}
                  placeholder="Commentaires pour l'élève..."
                  disabled={!isEditing}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className={`px-4 py-2 rounded text-white ${
                  darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                Annuler
              </button>
              
              {selectedSubmission.status === "reviewed" && !isEditing ? (
                <button
                  onClick={toggleEditMode}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                >
                  Modifier
                </button>
              ) : (
                <button
                  onClick={handleSaveGrade}
                  className={`px-4 py-2 text-white rounded ${
                    darkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-500 hover:bg-indigo-600'
                  }`}
                >
                  Enregistrer
                </button>
              )}
            </div>
          </>
        )}
      </Modal>
    </motion.div>
  );
};

export default SubmissionsTable;