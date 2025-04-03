import { useState, useEffect } from "react";
import { Eye, Edit2 } from "lucide-react";
import { motion } from "framer-motion";
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
      }}
    >
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full mx-4 p-6 overflow-auto max-h-screen my-4">
        {children}
      </div>
    </div>,
    document.body
  );
};

const SubmissionsTable = ({ submissions, loading, onGradeAdjust }) => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [adjustedGrade, setAdjustedGrade] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [portalContainer, setPortalContainer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

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

  return (
    <motion.div
      className="bg-gray-800 rounded-lg shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Soumissions récentes</h2>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-400">Chargement des soumissions...</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Élève
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Exercice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date de soumission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Note IA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Note finale
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      {submission.studentName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {submission.exerciseName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {new Date(submission.submittedAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {submission.aiScore}/20
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {submission.professorScore ? (
                      <span className="text-green-400">
                        {submission.professorScore}/20
                      </span>
                    ) : (
                      <span className="text-gray-500">En attente</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        submission.status === "reviewed"
                          ? "bg-green-800 text-green-100"
                          : "bg-yellow-800 text-yellow-100"
                      }`}
                    >
                      {submission.status === "reviewed"
                        ? "Corrigé"
                        : "En attente"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleReviewClick(submission)}
                      className="text-indigo-400 hover:text-indigo-300 mr-4"
                      title={
                        submission.status === "reviewed"
                          ? "Voir/Modifier"
                          : "Corriger"
                      }
                    >
                      {submission.status === "reviewed" ? (
                        <Eye size={18} />
                      ) : (
                        <Edit2 size={18} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {portalContainer && (
        <Modal isOpen={isModalOpen && selectedSubmission !== null} onClose={() => setIsModalOpen(false)}>
          {selectedSubmission && (
            <>
              <h3 className="text-xl font-bold text-white mb-4">
                {!isEditing && selectedSubmission.status === "reviewed"
                  ? "Détails de la soumission"
                  : "Correction"}
              </h3>

              <div className="mb-4">
                <p className="text-gray-300 mb-1">
                  <span className="font-medium">Élève:</span>{" "}
                  {selectedSubmission.studentName}
                </p>
                <p className="text-gray-300 mb-1">
                  <span className="font-medium">Exercice:</span>{" "}
                  {selectedSubmission.exerciseName}
                </p>
                <p className="text-gray-300 mb-1">
                  <span className="font-medium">Soumis le:</span>{" "}
                  {new Date(selectedSubmission.submittedAt).toLocaleString()}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-medium">Note IA:</p>
                  <p className="text-yellow-400 font-bold">
                    {selectedSubmission.aiScore}/20
                  </p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg mb-4">
                  <p className="text-gray-300 text-sm italic">
                    Analyse automatique...
                  </p>
                </div>

                <div className="mt-4">
                  <label className="block text-white font-medium mb-2">
                    Note ajustée:
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.5"
                    value={adjustedGrade}
                    onChange={(e) => setAdjustedGrade(parseFloat(e.target.value))}
                    className="bg-gray-700 text-white px-3 py-2 rounded w-full"
                    disabled={!isEditing}
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-white font-medium mb-2">
                    Commentaires:
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="bg-gray-700 text-white px-3 py-2 rounded w-full h-32"
                    placeholder="Commentaires pour l'élève..."
                    disabled={!isEditing}
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
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
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                  >
                    Enregistrer
                  </button>
                )}
              </div>
            </>
          )}
        </Modal>
      )}
    </motion.div>
  );
};

export default SubmissionsTable;