import { CheckCircle, FileText, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { useTheme } from "../context/ThemeContext";
import ClickableText from "../context/ClickableText";
import { fetchSoumissionsByEtu } from "../services/soumissionService";
import axiosInstance from "../services/api";  // Pour récupérer la signed URL

const API_BASE = import.meta.env.VITE_API_URL || '';  // Pour les requêtes backend

const NoteEtudiant = () => {
  const savedUser = JSON.parse(localStorage.getItem('user'));
  const etudiantId = savedUser.id;
  const { darkMode } = useTheme();
  const [devoirs, setDevoirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const loadSoumissions = async () => {
      setLoading(true);
      try {
        const { data } = await fetchSoumissionsByEtu(etudiantId);
        const mapped = data.map(s => ({
          id: s.id,
          title: s.sujet.titre,
          grade: s.note_final ?? s.note_automatique,
          maxGrade: 20,
          status: s.etat === 'CORRIGE' ? 'Corrigé' : 'En attente',
          studentFile: s.chemin_fichier_pdf,
          correctionFile: s.chemin_fichier_pdf_ia,
        }));
        setDevoirs(mapped);
      } catch (err) {
        console.error('Erreur lors du chargement des soumissions', err.response?.status, err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    loadSoumissions();
  }, [etudiantId]);

  // Nouvelle fonction pour récupérer la signed URL
  const openPdfViewer = async (cheminFichier) => {
    try {
      console.log('Chemin brut:', cheminFichier);
  
      let cleanPath = cheminFichier.replace(/^\/?uploads\//, ''); // enlève /uploads/
  
     // Si le chemin NE commence PAS par 'sujets/' ET NE commence PAS par 'soumissions/'
if (!cheminFichier.startsWith('sujets/') && !cheminFichier.startsWith('soumissions/')) {
  cleanPath = `soumissions/${cleanPath}`;
}
  
      console.log('Chemin nettoyé:', cleanPath);
  
      const response = await axiosInstance.get('/soumissions/signed-url', { params: { path: cleanPath } });
      const signedUrl = response.data.url;
  
      setSelectedPdf(signedUrl);
      setShowPdfViewer(true);
    } catch (error) {
      console.error('Erreur récupération signed URL:', error);
    }
  };
  

  if (loading) return <p className={darkMode ? 'text-white' : 'text-gray-800'}>Chargement des résultats...</p>;

  return (
    <div className={`flex-1 overflow-auto transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title={<ClickableText id="grades-title" effect="📝" effectDuration={800}>Notes et Corrections des Devoirs</ClickableText>} />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <StatCard name={<ClickableText id="assignments-submitted" effect="📄">Devoirs soumis</ClickableText>}
                    icon={FileText} value={devoirs.length}
                    color={darkMode ? '#818cf8' : '#6366F1'} darkMode={darkMode} />
          <StatCard name={<ClickableText id="average-grades" effect="📊">Moyenne des notes</ClickableText>}
                    icon={CheckCircle}
                    value={devoirs.filter(d => d.grade != null).length > 0
                      ? (devoirs.filter(d => d.grade != null).reduce((acc, curr) => acc + curr.grade, 0) / devoirs.filter(d => d.grade != null).length).toFixed(2)
                      : '-'}
                    color={darkMode ? '#34d399' : '#10B981'} darkMode={darkMode} />
        </motion.div>

        <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <table className="w-full">
            <thead>
              <tr className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                {['Devoir', 'Statut', 'Note', 'Actions'].map(h => (
                  <th key={h} className={`p-3 border-b ${darkMode ? 'border-gray-600 text-white' : 'border-gray-200 text-gray-800'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {devoirs.map(d => (
                <tr key={d.id} className={`border-b ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-800'}`}>
                  <td className="p-3">{d.title}</td>
                  <td className="p-3">{d.status}</td>
                  <td className="p-3">{d.grade != null ? `${d.grade} / ${d.maxGrade}` : '-'}</td>
                  <td className="p-3 space-x-2">
                    {d.studentFile && (
                      <button
                        className={`px-3 py-1 rounded ${darkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-blue-600 hover:bg-blue-500'} text-white`}
                        onClick={() => openPdfViewer(d.studentFile)}
                      >
                        Voir Devoir
                      </button>
                    )}
                    {d.status === 'Corrigé' && d.correctionFile && (
                      <button
                        className={`px-3 py-1 rounded ${darkMode ? 'bg-green-600 hover:bg-green-500' : 'bg-green-500 hover:bg-green-400'} text-white`}
                        onClick={() => openPdfViewer(d.correctionFile)}
                      >
                        Voir Correction IA
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showPdfViewer && selectedPdf && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-xl p-6 w-full max-w-5xl h-4/5 transition-colors duration-300`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Fichier PDF</h2>
                <button onClick={() => setShowPdfViewer(false)}><X size={24} /></button>
              </div>
              <iframe
                src={selectedPdf}
                className="w-full h-full rounded"
                title="Fichier PDF"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NoteEtudiant;
