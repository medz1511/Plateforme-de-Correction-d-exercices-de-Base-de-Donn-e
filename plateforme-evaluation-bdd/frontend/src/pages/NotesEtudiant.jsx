import { CheckCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import CorrectionTable from "../components/correction/CorrectionTable";
import { useTheme } from "../context/ThemeContext";
import ClickableText from "../context/ClickableText";

const devoirsData = [
  { id: 1, title: "Requête SQL avancée", grade: 16, maxGrade: 20, status: "Corrigé", studentFile: "../../upload/Memo_final.pdf", correctionFile: "../../upload/ExamenMaster1.pdf" },
  { id: 2, title: "Modélisation relationnelle", grade: 14, maxGrade: 20, status: "Corrigé", studentFile: "../../upload/devoir2.sql", correctionFile: "../../upload/ExamenMaster1.pdf" },
  { id: 3, title: "Indexation et performance", grade: null, maxGrade: 20, status: "En attente", studentFile: "/pdfs/devoir3.php", correctionFile: "" },
  { id: 4, title: "Transactions et ACID", grade: null, maxGrade: 20, status: "Refusé", studentFile: "/pdfs/devoir4.pdf", correctionFile: "" },
];

const getFileType = (filePath) => {
  const extension = filePath.split('.').pop().toLowerCase();
  if (['pdf'].includes(extension)) return 'pdf';
  if (['sql', 'php', 'txt'].includes(extension)) return 'text';
  return 'unknown';
};

const NoteEtudiant = () => {
  const { darkMode } = useTheme();
  const [devoirs, setDevoirs] = useState(devoirsData);
  const [loading, setLoading] = useState(true);
  const [selectedDevoir, setSelectedDevoir] = useState(null);
  const [studentFileContent, setStudentFileContent] = useState("");
  const [correctionFileContent, setCorrectionFileContent] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setDevoirs(devoirsData);
      setLoading(false);
    }, 1500);
  }, []);

  const loadFileContent = async (filePath, type) => {
    console.log(`Chargement du fichier ${type} :`, filePath);
    if (type === "student") {
      setStudentFileContent("Chargement en cours...");
    } else {
      setCorrectionFileContent("Chargement en cours...");
    }

    try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`Erreur ${response.status}: ${response.statusText}`);

      const text = await response.text();
      console.log(`Contenu du fichier ${type} :`, text);
      if (type === "student") {
        setStudentFileContent(text);
      } else {
        setCorrectionFileContent(text);
      }
    } catch (error) {
      console.error(`Erreur lors du chargement du fichier ${type} :`, error);
      if (type === "student") {
        setStudentFileContent("Impossible de charger le fichier.");
      } else {
        setCorrectionFileContent("Impossible de charger le fichier.");
      }
    }
  };

  if (loading) return <p className={darkMode ? "text-white" : "text-gray-800"}>Chargement des résultats...</p>;

  return (
    <div className={`flex-1 overflow-auto relative z-10 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title={
        <ClickableText id="grades-title" effect="📝" effectDuration={800}>
          Notes et Corrections des Devoirs
        </ClickableText>
      } />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard 
            name={<ClickableText id="assignments-submitted" effect="📄">Devoirs soumis</ClickableText>}
            icon={FileText} 
            value={devoirs.length} 
            color={darkMode ? "#818cf8" : "#6366F1"}
            darkMode={darkMode}
          />
          <StatCard
            name={<ClickableText id="average-grades" effect="📊">Moyenne des notes</ClickableText>}
            icon={CheckCircle}
            value={(
              devoirs.filter(d => d.grade !== null).reduce((acc, curr) => acc + curr.grade, 0) /
              devoirs.filter(d => d.grade !== null).length
            ).toFixed(2)}
            color={darkMode ? "#34d399" : "#10B981"}
            darkMode={darkMode}
          />
        </motion.div>

        <div className={`rounded-lg overflow-hidden transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
          <table className="w-full">
            <thead>
              <tr className={darkMode ? "bg-gray-700" : "bg-gray-100"}>
                <th className={`p-3 border-b ${darkMode ? 'border-gray-600 text-white' : 'border-gray-200 text-gray-800'}`}>Devoir</th>
                <th className={`p-3 border-b ${darkMode ? 'border-gray-600 text-white' : 'border-gray-200 text-gray-800'}`}>Statut</th>
                <th className={`p-3 border-b ${darkMode ? 'border-gray-600 text-white' : 'border-gray-200 text-gray-800'}`}>Note</th>
                <th className={`p-3 border-b ${darkMode ? 'border-gray-600 text-white' : 'border-gray-200 text-gray-800'}`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {devoirs.map((devoir) => (
                <tr 
                  key={devoir.id} 
                  className={`border-b ${darkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-800'}`}
                >
                  <td className="p-3">{devoir.title}</td>
                  <td className="p-3">{devoir.status}</td>
                  <td className="p-3">{devoir.grade !== null ? `${devoir.grade} / ${devoir.maxGrade}` : "-"}</td>
                  <td className="p-3">
                    {devoir.status === "Corrigé" && devoir.correctionFile && (
                      <button 
                        className={`px-4 py-2 rounded transition-colors ${darkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-blue-600 hover:bg-blue-500'} text-white`}
                        onClick={() => {
                          setSelectedDevoir(devoir);
                          loadFileContent(devoir.studentFile, "student");
                          loadFileContent(devoir.correctionFile, "correction");
                        }}
                      >
                        Voir Correction
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedDevoir && (
          <motion.div 
            className={`mt-6 p-4 rounded flex gap-4 relative ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-1/2">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Devoir soumis :</h3>
              {getFileType(selectedDevoir.studentFile) === 'pdf' ? (
                <embed src={selectedDevoir.studentFile} type="application/pdf" className="w-full h-96" />
              ) : getFileType(selectedDevoir.studentFile) === 'text' ? (
                <pre className={`w-full h-96 overflow-auto p-4 ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
                  {studentFileContent}
                </pre>
              ) : (
                <p className={darkMode ? "text-gray-300" : "text-gray-600"}>Format de fichier non supporté pour l'affichage</p>
              )}
            </div>
            <div className="w-1/2">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Correction :</h3>
              {getFileType(selectedDevoir.correctionFile) === 'pdf' ? (
                <embed src={selectedDevoir.correctionFile} type="application/pdf" className="w-full h-96" />
              ) : getFileType(selectedDevoir.correctionFile) === 'text' ? (
                <pre className={`w-full h-96 overflow-auto p-4 ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
                  {correctionFileContent}
                </pre>
              ) : (
                <p className={darkMode ? "text-gray-300" : "text-gray-600"}>Format de fichier non supporté pour l'affichage</p>
              )}
            </div>
            <button 
              className={`absolute top-2 right-2 px-4 py-2 rounded transition-colors ${darkMode ? 'bg-red-600 hover:bg-red-500' : 'bg-red-500 hover:bg-red-400'} text-white`}
              onClick={() => setSelectedDevoir(null)}
            >
              Fermer
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default NoteEtudiant;