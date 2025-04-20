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
  AlertCircle,
  Calendar,
  Info
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
// on importe à la fois l’instance axios ET la constante de base URL
const API = import.meta.env.VITE_API_URL || '';

export default function AccesSujetsDeposesEtudiant() {
  const { darkMode } = useTheme();
  const [sujets, setSujets] = useState([]);
  const [soumissions, setSoumissions] = useState([]);
  const [uploadingId, setUploadingId] = useState(null);
  const [fileError, setFileError] = useState("");
  const [confirmWithdrawId, setConfirmWithdrawId] = useState(null);
  const [viewingDetailsId, setViewingDetailsId] = useState(null);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState({ title: "", path: "" });
  const fileInputRefs = useRef({});
  const user = JSON.parse(localStorage.getItem("user"));

  // Chargement initial
  useEffect(() => {
    fetchSujets().then(r => setSujets(r.data)).catch(console.error);
    fetchSoumissionsByEtu(user.id).then(r => setSoumissions(r.data)).catch(console.error);
  }, [user.id]);

  // Helpers & stats
  const getSubmission   = sujetId => soumissions.find(s => s.sujet_id === sujetId);
  const isSubmitted     = id => !!getSubmission(id);
  const isCorrected     = id => getSubmission(id)?.etat === "CORRIGE";
  const isDeadlinePassed= dl => new Date() > new Date(dl);
  const isDeadlineClose = dl => {
    const diff = new Date(dl) - Date.now();
    return diff > 0 && diff <= 3*24*60*60*1000;
  };
  const total          = sujets.length;
  const today          = new Date().toISOString().slice(0,10);
  const newToday       = sujets.filter(s => s.date_creation.slice(0,10) === today).length;
  const submittedCount = soumissions.filter(s => s.etat === "SOUMIS" || "CORRIGE").length;

  // Ouvre l’input fichier caché
  const openFileSelector = sujetId => {
    const inp = fileInputRefs.current[sujetId];
    if (inp) inp.click();
  };

  // Gère l’upload ou la correction
  const handleFileChange = async (sujetId, e) => {
    const f = e.target.files[0];
    if (!f || f.size > 10*1024*1024) {
      setFileError("Fichier ≤ 10 Mo requis.");
      return;
    }
    setFileError("");
    const sub = getSubmission(sujetId);
    try {
      if (sub) await corrigerSoumission(sub.id, f);
      else     await uploadSubmission({ userId:user.id, sujetId, file:f });
      setSoumissions(await fetchSoumissionsByEtu(user.id).then(r=>r.data));
    } catch(err) {
      console.error(err);
      setFileError("Erreur lors de l’envoi.");
    }
    setUploadingId(null);
  };

  // Supprime son rendu
  const confirmWithdraw = async () => {
    const sub = getSubmission(confirmWithdrawId);
    if (sub) {
      await deleteSoumission(sub.id);
      setSoumissions(await fetchSoumissionsByEtu(user.id).then(r=>r.data));
    }
    setConfirmWithdrawId(null);
  };

  // Ouvre la visionneuse PDF
  const openPdfViewer = (title, path) => {
    setSelectedPdf({ title, path });
    setShowPdfViewer(true);
  };
  const closePdfViewer = () => setShowPdfViewer(false);

  // Téléchargement
  const download = (path,name) => {
    const a = document.createElement("a");
    a.href = `${API}${path}`;       // <-- on utilise API
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  console.log(sujets)
  return (
    <div className={`flex-1 ${darkMode?"bg-gray-900":"bg-gray-50"} transition-colors`}>
      <Header title="Accès aux Sujets Déposés" />

      <main className="max-w-7xl mx-auto py-6 px-4">

        {/* Statistiques */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8}}
        >
          <StatCard name="Total Sujets"         icon={FileText}    value={total}          darkMode={darkMode}/>
          <StatCard name="Nouveaux Aujourd'hui" icon={CheckCircle} value={newToday}       darkMode={darkMode}/>
          <StatCard name="Sujets Soumis"        icon={CheckCircle} value={submittedCount}darkMode={darkMode}/>
        </motion.div>
        
        {/* Cartes de sujets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sujets.map(s => {
            const sub = getSubmission(s.id);
            const passed = isDeadlinePassed(s.date_limite);
            const fileName = sub?.chemin_fichier_pdf?.split("/").pop() ?? "";
            return (
              <motion.div
                key={s.id}
                className={`p-6 rounded-lg shadow-lg transition-colors ${darkMode?"bg-gray-800":"bg-white"}`}
                whileHover={{scale:1.02}}
              >
                {/* En‑tête */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-lg font-semibold ${darkMode?"text-gray-100":"text-gray-900"}`}>
                      {s.titre}
                    </h3>
                    <p className={`text-sm ${darkMode?"text-gray-400":"text-gray-600"}`}>
                      Publié le {new Date(s.date_creation).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <Calendar size={14}/>
                    {new Date(s.date_limite).toLocaleDateString("fr-FR")}
                    {isDeadlineClose(s.date_limite)&&" (bientôt)"}
                  </span>
                </div>

                {/* Description */}
                <p className={`mb-2 ${darkMode?"text-gray-300":"text-gray-600"}`} style={{minHeight:48}}>
                  {s.description?.slice(0,100)}…
                </p>

                {/* Nom du fichier rendu */}
                {sub && (
                  <p className={`mb-4 text-sm ${darkMode?"text-gray-300":"text-gray-600"}`}>
                    <strong>Mon fichier :</strong> {fileName}
                  </p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 text-xs rounded ${
                    sub?"bg-green-100 text-green-800":"bg-red-100 text-red-800"
                  }`}>{sub?"Soumis":"Non soumis"}</span>
                  {sub && isCorrected(s.id) && (
                    <span className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-800">
                      Corrigé
                    </span>
                  )}
                  {passed && !sub && (
                    <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                      Clôturé
                    </span>
                  )}
                </div>

                {/* Boutons d’action */}
                <div className="flex flex-wrap gap-2">
                  {/* input fichier caché */}
                  <input
                    type="file"
                    ref={el=>fileInputRefs.current[s.id]=el}
                    style={{display:"none"}}
                    onChange={e=>handleFileChange(s.id,e)}
                  />

                  {/* Voir PDF du sujet */}
                  <button
                    onClick={()=>openPdfViewer(s.titre,s.chemin_fichier_pdf)}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded ${
                      darkMode?"bg-violet-600 hover:bg-violet-700":"bg-violet-500 hover:bg-violet-600"
                    } text-white`}
                  >
                    <Eye size={16}/>Voir PDF
                  </button>

                  {/* Télécharger le sujet
                  <button
                    onClick={()=>download(s.chemin_fichier_pdf,`${s.titre}.pdf`)}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 rounded ${
                      darkMode?"bg-pink-600 hover:bg-pink-700":"bg-pink-500 hover:bg-pink-600"
                    } text-white`}
                  >
                    <Download size={16}/>Télécharger
                  </button> */}



                  {/* Rendre / remplacer */}
                  {!sub && !passed && (
                    <button
                      onClick={()=>setUploadingId(s.id)}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded ${
                        darkMode?"bg-green-600 hover:bg-green-700":"bg-green-500 hover:bg-green-600"
                      } text-white`}
                    >
                      <Upload size={16}/>Rendre
                    </button>
                  )}
                  {sub && !passed && !isCorrected(s.id) && (
                    <>
                      <button onClick={()=>setUploadingId(s.id)}>
                        <RefreshCw size={18}/>
                      </button>
                      <button onClick={()=>setConfirmWithdrawId(s.id)}>
                        <X size={18}/>
                      </button>
                    </>
                  )}

                  {/* Voir plus */}
                  <button
                    onClick={()=>setViewingDetailsId(s.id)}
                    className={`p-2 rounded ${
                      darkMode?"bg-blue-600 hover:bg-blue-700":"bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                  >
                    <Info size={16}/>Voir plus
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Modal “Voir plus” */}
        {viewingDetailsId && (() => {
          const sujet   = sujets.find(x=>x.id===viewingDetailsId);
          const sub     = getSubmission(viewingDetailsId);
          const fileName= sub?.chemin_fichier_pdf?.split("/").pop() ?? "";
          return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className={`w-full max-w-2xl p-6 rounded-lg shadow-lg transition-colors ${
                darkMode?"bg-gray-800 text-gray-100":"bg-white text-gray-900"
              }`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">{sujet.titre}</h2>
                  <button onClick={()=>setViewingDetailsId(null)}><X size={24}/></button>
                </div>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <dt className="text-sm text-gray-400 flex items-center gap-1">
                      <Calendar size={14}/>Publié le
                    </dt>
                    <dd className="mt-1">
                      {new Date(sujet.date_creation).toLocaleDateString("fr-FR")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400 flex items-center gap-1">
                      <Calendar size={14}/>Date limite
                    </dt>
                    <dd className="mt-1">
                      {new Date(sujet.date_limite).toLocaleDateString("fr-FR")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400">Mon rendu</dt>
                    <dd className="mt-1">
                      {sub
                        ? fileName
                        : <span className="text-red-500">Non soumis</span>}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400">Soumis le</dt>
                    <dd className="mt-1">
                      {sub 
                        ? new Date(sub.date_soumission).toLocaleString()
                        : "-"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400">Statut</dt>
                    <dd className="mt-1">
                      {sub && isCorrected(sujet.id)
                        ? <span className="text-indigo-500">Corrigé</span>
                        : <span className="text-yellow-500">En attente</span>}
                    </dd>
                  </div>
                </dl>

                <p className={`mb-6 ${darkMode?"text-gray-300":"text-gray-600"}`}>
                  {sujet.description}
                </p>

                {sub && (
  <button
    onClick={() => openPdfViewer(
      sujet.titre,            // ou un titre plus parlant
      sub.chemin_fichier_pdf
    )}
    className={`mb-6 px-4 py-2 rounded ${
      darkMode ? "bg-violet-600 hover:bg-violet-700" : "bg-violet-500 hover:bg-violet-600"
    } text-white`}
  >
    <Eye className="inline mr-2"/>Voir mon rendu
  </button>
                )}

                <button
                  onClick={()=>setViewingDetailsId(null)}
                  className={`px-4 py-2 rounded ${
                    darkMode
                      ? "bg-gray-600 hover:bg-gray-700 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  }`}
                >
                  Fermer
                </button>
              </div>
            </div>
          );
        })()}

        {/* Modal d’upload */}
        {uploadingId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`p-6 rounded shadow-lg w-96 transition-colors ${
              darkMode?"bg-gray-800 text-gray-100":"bg-white text-gray-900"
            }`}>
              {fileError && <p className="mb-4 text-red-500">{fileError}</p>}
              <p className="mb-4">
                Sélectionnez un fichier pour <strong>
                  {sujets.find(s=>s.id===uploadingId)?.titre}
                </strong>
              </p>
              <div className="flex justify-center mb-4">
                <button
                  onClick={()=>openFileSelector(uploadingId)}
                  className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  <FileText size={18} className="mr-1"/>Choisir le fichier
                </button>
              </div>
              <div className="flex justify-end">
                <button onClick={()=>setUploadingId(null)}>Annuler</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de retrait */}
        {confirmWithdrawId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`p-6 rounded shadow-lg w-96 transition-colors ${
              darkMode?"bg-gray-800 text-gray-100":"bg-white text-gray-900"
            }`}>
              <p className="mb-4">
                Retirer le dépôt pour <strong>
                  {sujets.find(s=>s.id===confirmWithdrawId)?.titre}
                </strong>&nbsp;?
              </p>
              <div className="flex justify-end space-x-2">
                <button onClick={()=>setConfirmWithdrawId(null)}>Annuler</button>
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

        {/* Visionneuse PDF */}
        {showPdfViewer && selectedPdf.path && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`w-full max-w-5xl h-4/5 p-6 rounded-lg transition-colors ${
              darkMode?"bg-gray-800 text-gray-100":"bg-white text-gray-900"
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{selectedPdf.title}</h2>
                <button onClick={closePdfViewer}><X size={24}/></button>
              </div>
              <iframe
                src={`${API}${selectedPdf.path}`}
                className="w-full h-full rounded"
                title={selectedPdf.title}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
