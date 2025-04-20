// src/pages/AccesSujetsDeposesEtudiant.jsx

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle,
  Upload,
  X,
  RefreshCw,
  Eye,
  Download,
  AlertCircle
} from "lucide-react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { useTheme } from "../context/ThemeContext";
import { fetchSujets } from "../services/sujetService";
import {
  fetchSoumissionsByEtu,
  deleteSoumission,
  uploadSubmission,
  corrigerSoumission
} from "../services/soumissionService";
import API from "../services/api";

const AccesSujetsDeposesEtudiant = () => {
  const { darkMode } = useTheme();
  const [sujets, setSujets] = useState([]);
  const [soumissions, setSoumissions] = useState([]);
  const [uploadingId, setUploadingId] = useState(null);
  const [fileError, setFileError] = useState("");
  const [confirmWithdrawId, setConfirmWithdrawId] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const fileInputRefs = useRef({});
  const savedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchSujets()
      .then(res => setSujets(res.data))
      .catch(console.error);

    fetchSoumissionsByEtu(savedUser.id)
      .then(res => setSoumissions(res.data))
      .catch(console.error);
  }, []);

  // Statistiques
  const totalSubjects     = sujets.length;
  const todayStr          = new Date().toISOString().substr(0,10);
  const newSubjectsToday  = sujets.filter(s => s.date_creation?.substr(0,10) === todayStr).length;
  const submittedSubjects = soumissions.filter(s => s.etat === "SOUMIS").length;

  // Helpers
  const isSubmitted       = id => soumissions.some(s => s.sujet_id === id && s.etat === "SOUMIS");
  const isDeadlinePassed  = date => new Date() > new Date(date);
  const isDeadlineClose   = date => {
    const diff = new Date(date) - new Date();
    return diff > 0 && diff <= 3 * 24 * 60 * 60 * 1000;
  };

  // Upload / correction
  const openFileSelector = id => fileInputRefs.current[id]?.click();
  const handleFileChange = async (sujetId, e) => {
    const file = e.target.files[0];
    // if (!file || file.type !== "application/pdf" || file.size > 10*1024*1024) {
    //   setFileError("Fichier PDF requis (≤ 10 Mo).");
    if (!file || file.size > 10*1024*1024) {
        setFileError("Fichier requis (taille ≤ 10 Mo).");
      return;
    }
    setFileError("");
    const existing = soumissions.find(s => s.sujet_id === sujetId);
    try {
      if (existing) {
        await corrigerSoumission(existing.id, file);
      } else {
        await uploadSubmission({ sujetId, userId: savedUser.id, file });
      }
      const fresh = await fetchSoumissionsByEtu(savedUser.id).then(r => r.data);
      setSoumissions(fresh);
    } catch(err) {
      console.error(err);
    } finally {
      setUploadingId(null);
    }
  };

  const handleSubmitClick   = id => setUploadingId(id);
  const handleWithdrawClick = id => setConfirmWithdrawId(id);
  const confirmWithdraw     = async () => {
    const sub = soumissions.find(s => s.sujet_id === confirmWithdrawId);
    if (sub) {
      await deleteSoumission(sub.id);
      const fresh = await fetchSoumissionsByEtu(savedUser.id).then(r => r.data);
      setSoumissions(fresh);
    }
    setConfirmWithdrawId(null);
  };

  // Détails
  const viewSubjectDetails = id => {
    const subj = sujets.find(s => s.id === id);
    setViewingDetails(subj);
  };

  // PDF Viewer
  const openPdfViewer = sujet => {
    setSelectedPdf({
      exerciseTitle: sujet.titre,
      pdfUrl: sujet.chemin_fichier_pdf
    });
    setShowPdfViewer(true);
  };

  const downloadPdf = sujet => {
    const url = `${API}${sujet.chemin_fichier_pdf}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sujet.titre}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={`flex-1 ${darkMode ? "bg-gray-900" : "bg-gray-50"} transition-colors`}>
      <Header title="Accès aux Sujets Déposés" />
      <main className="max-w-7xl mx-auto py-6 px-4">

        {/* Statistiques */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.8 }}
        >
          <StatCard name="Total Sujets"         icon={FileText}    value={totalSubjects}    darkMode={darkMode}/>
          <StatCard name="Nouveaux Aujourd'hui" icon={CheckCircle} value={newSubjectsToday} darkMode={darkMode}/>
          <StatCard name="Sujets Soumis"       icon={CheckCircle} value={submittedSubjects}darkMode={darkMode}/>
        </motion.div>

        {/* Tableau */}
        <motion.div className="overflow-x-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <table className="min-w-full">
            <thead className={`${darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-600"} uppercase text-xs`}>
              <tr>
                <th className="px-6 py-3 text-left">Sujet</th>
                <th className="px-6 py-3 text-center">Deadline</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sujets.map(sujet => {
                const submitted = isSubmitted(sujet.id);
                const passed    = isDeadlinePassed(sujet.date_limite);
                return (
                  <tr key={sujet.id} className={`border-b hover:bg-gray-50 ${darkMode && "hover:bg-gray-800"}`}>
                    <td className="px-6 py-3">{sujet.titre}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={isDeadlineClose(sujet.date_limite) ? "text-yellow-500" : ""}>
                        {new Date(sujet.date_limite).toLocaleDateString("fr-FR")}
                        {isDeadlineClose(sujet.date_limite) && " (bientôt)"}
                      </span>
                    </td>
                    <td className="px-6 py-3 flex items-center justify-center space-x-2">
                      <input
                        type="file"
                        // accept="application/pdf"
                        ref={el => fileInputRefs.current[sujet.id] = el}
                        style={{ display: 'none' }}
                        onChange={e => handleFileChange(sujet.id, e)}
                      />

                      {/* Voir (violet) */}
                      <button
                        onClick={() => openPdfViewer(sujet)}
                        title="Visualiser le PDF"
                        className={`p-2 rounded transition-colors ${
                          darkMode ? "bg-violet-600 hover:bg-violet-700" : "bg-violet-500 hover:bg-violet-600"
                        }`}
                      >
                        <Eye className="text-white" size={18}/>
                      </button>

                      {/* Télécharger (rose) */}
                      <button
                        onClick={() => downloadPdf(sujet)}
                        title="Télécharger le sujet"
                        className={`p-2 rounded transition-colors ${
                          darkMode ? "bg-pink-600 hover:bg-pink-700" : "bg-pink-500 hover:bg-pink-600"
                        }`}
                      >
                        <Download className="text-white" size={18}/>
                      </button>

                      {/* Rendre / remplacer / retirer */}
                      {!submitted && !passed && (
                        <button
                          onClick={() => setUploadingId(sujet.id)}
                          className={`flex items-center px-3 py-1 rounded text-white ${
                            darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          <Upload className="mr-1" size={16}/> Rendre
                        </button>
                      )}
                      {submitted && !passed && (
                        <>
                          <button onClick={() => setUploadingId(sujet.id)}>
                            <RefreshCw size={18}/>
                          </button>
                          <button onClick={() => setConfirmWithdrawId(sujet.id)}>
                            <X size={18}/>
                          </button>
                        </>
                      )}
                      {!submitted && passed && (
                        <span className="text-red-600 flex items-center">
                          <AlertCircle size={18}/> Clôturé
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

        {/* Upload Modal */}
        {uploadingId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`p-6 rounded shadow-lg w-96 transition-colors ${
              darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
            }`}>
              {fileError && <p className="mb-4 text-red-500">{fileError}</p>}
              <p className="mb-4">
                Sélectionnez un PDF pour <strong>{sujets.find(s=>s.id===uploadingId)?.titre}</strong>
              </p>
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => openFileSelector(uploadingId)}
                  className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  <FileText size={18} className="mr-1"/> Choisir le fichier
                </button>
              </div>
              <div className="flex justify-end">
                <button onClick={() => setUploadingId(null)}>Annuler</button>
              </div>
            </div>
          </div>
        )}

        {/* Withdraw Modal */}
        {confirmWithdrawId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`p-6 rounded shadow-lg w-96 transition-colors ${
              darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
            }`}>
              <p className="mb-4">
                Retirer le dépôt pour <strong>{sujets.find(s=>s.id===confirmWithdrawId)?.titre}</strong> ?
              </p>
              <div className="flex justify-end space-x-2">
                <button onClick={() => setConfirmWithdrawId(null)}>Annuler</button>
                <button
                  onClick={confirmWithdraw}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PDF Viewer */}
        {showPdfViewer && selectedPdf && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-xl p-6 w-full max-w-5xl h-4/5 transition-colors duration-300`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{selectedPdf.exerciseTitle}</h2>
                <button onClick={() => setShowPdfViewer(false)}>
                  <X size={24}/>
                </button>
              </div>
              <iframe
                src={`${API}${selectedPdf.pdfUrl}`}
                className="w-full h-full rounded"
                title={selectedPdf.exerciseTitle}
              />
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AccesSujetsDeposesEtudiant;
