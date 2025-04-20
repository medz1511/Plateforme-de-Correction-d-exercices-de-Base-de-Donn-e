import { CheckCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { useTheme } from "../context/ThemeContext";
import ClickableText from "../context/ClickableText";
import { fetchSoumissionsByEtu } from "../services/soumissionService";

const getFileType = (filePath) => {
  const ext = filePath.split('.').pop().toLowerCase();
  if (['pdf'].includes(ext)) return 'pdf';
  if (['sql', 'php', 'txt'].includes(ext)) return 'text';
  return 'unknown';
};

const savedUser = JSON.parse(localStorage.getItem('user'));

const NoteEtudiant = ({ etudiantId = savedUser.id }) => {
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
          id:             s.id,
          title:          s.sujet.titre,
          grade:          s.note_final ?? s.note_automatique,
          maxGrade:       20,
          status:         s.etat === 'CORRIGE' ? 'Corrigé' : 'En attente',
          studentFile:    s.chemin_fichier_pdf,
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

  if (loading) return <p className={darkMode ? 'text-white' : 'text-gray-800'}>Chargement des résultats...</p>;

  return (
    <div className={`flex-1 overflow-auto transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header
        title={
          <ClickableText id="grades-title" effect="📝" effectDuration={800}>
            Notes et Corrections des Devoirs
          </ClickableText>
        }
      />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <StatCard
            name={<ClickableText id="assignments-submitted" effect="📄">Devoirs soumis</ClickableText>}
            icon={FileText}
            value={devoirs.length}
            color={darkMode ? '#818cf8' : '#6366F1'} darkMode={darkMode}
          />
          <StatCard
            name={<ClickableText id="average-grades" effect="📊">Moyenne des notes</ClickableText>}
            icon={CheckCircle}
            value={
              devoirs.filter(d => d.grade != null).length > 0
                ? (devoirs.filter(d => d.grade != null).reduce((acc, curr) => acc + curr.grade, 0) /
                   devoirs.filter(d => d.grade != null).length).toFixed(2)
                : '-'
            }
            color={darkMode ? '#34d399' : '#10B981'} darkMode={darkMode}
          />
        </motion.div>

        <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>        
          <table className="w-full">
            <thead>
              <tr className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
                {['Devoir','Statut','Note','Actions'].map(h => (
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
                    <button
                      className={`px-3 py-1 rounded ${darkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-blue-600 hover:bg-blue-500'} text-white`}
                      onClick={() => { setSelectedPdf(d.studentFile); setShowPdfViewer(true); }}
                    >
                      Voir Devoir
                    </button>
                    {d.status === 'Corrigé' && (
                      <button
                        className={`px-3 py-1 rounded ${darkMode ? 'bg-green-600 hover:bg-green-500' : 'bg-green-500 hover:bg-green-400'} text-white`}
                        onClick={() => { setSelectedPdf(d.correctionFile); setShowPdfViewer(true); }}
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

        {showPdfViewer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded w-11/12 h-5/6 relative p-4">
              <button
                className="absolute top-3 right-3 text-white bg-red-500 hover:bg-red-400 rounded px-3 py-1"
                onClick={() => setShowPdfViewer(false)}
              >
                Fermer
              </button>
              <embed src={selectedPdf} type="application/pdf" className="w-full h-full" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NoteEtudiant;
