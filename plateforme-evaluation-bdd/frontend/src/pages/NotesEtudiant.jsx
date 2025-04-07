import { CheckCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

const devoirsData = [
  { id: 1, title: "Requête SQL avancée", grade: 16, maxGrade: 20, status: "Corrigé", studentFile: "../../upload/Memo_final.pdf", correctionFile: "../../upload/ExamenMaster1.pdf" },
  { id: 2, title: "Modélisation relationnelle", grade: 14, maxGrade: 20, status: "Corrigé", studentFile: "../../upload/devoir2.sql", correctionFile: "../../upload/Memo_final.pdf" },
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
  const [devoirs, setDevoirs] = useState(devoirsData);
  const [loading, setLoading] = useState(true);
  const [selectedDevoir, setSelectedDevoir] = useState(null);
  const [studentFileContent, setStudentFileContent] = useState(""); // Contenu du fichier soumis
  const [correctionFileContent, setCorrectionFileContent] = useState(""); // Contenu du fichier de correction

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
      console.log(`Contenu du fichier ${type} :`, text); // Vérifie dans la console
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

  if (loading) return <p>Chargement des résultats...</p>;

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
      <Header title="Notes et Corrections des Devoirs" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Devoirs soumis" icon={FileText} value={devoirs.length} color="#6366F1" />
          <StatCard
            name="Moyenne des notes"
            icon={CheckCircle}
            value={(
              devoirs.filter(d => d.grade !== null).reduce((acc, curr) => acc + curr.grade, 0) /
              devoirs.filter(d => d.grade !== null).length
            ).toFixed(2)}
            color="#10B981"
          />
        </motion.div>

        <table className="w-full text-white border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-3 border-b border-gray-700">Devoir</th>
              <th className="p-3 border-b border-gray-700">Statut</th>
              <th className="p-3 border-b border-gray-700">Note</th>
              <th className="p-3 border-b border-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {devoirs.map((devoir) => (
              <tr key={devoir.id} className="text-center border-b border-gray-700">
                <td className="p-3">{devoir.title}</td>
                <td className="p-3">{devoir.status}</td>
                <td className="p-3">{devoir.grade !== null ? `${devoir.grade} / ${devoir.maxGrade}` : "-"}</td>
                <td className="p-3">
                  {devoir.status === "Corrigé" && devoir.correctionFile && (
                    <button 
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                      onClick={() => {
                        setSelectedDevoir(devoir);
                        loadFileContent(devoir.studentFile, "student"); // Charger le fichier de l'étudiant
                        loadFileContent(devoir.correctionFile, "correction"); // Charger le fichier de correction
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

        {selectedDevoir && (
          <div className="mt-6 p-4 bg-gray-800 text-white rounded flex gap-4 relative">
            <div className="w-1/2">
              <h3 className="text-lg font-semibold">Devoir soumis :</h3>
              {getFileType(selectedDevoir.studentFile) === 'pdf' ? (
                <embed src={selectedDevoir.studentFile} type="application/pdf" className="w-full h-96" />
              ) : getFileType(selectedDevoir.studentFile) === 'text' ? (
                <pre className="w-full h-96 overflow-auto bg-gray-700 p-4">{studentFileContent}</pre>
              ) : (
                <p>Format de fichier non supporté pour l'affichage</p>
              )}
            </div>
            <div className="w-1/2">
              <h3 className="text-lg font-semibold">Correction :</h3>
              {getFileType(selectedDevoir.correctionFile) === 'pdf' ? (
                <embed src={selectedDevoir.correctionFile} type="application/pdf" className="w-full h-96" />
              ) : getFileType(selectedDevoir.correctionFile) === 'text' ? (
                <pre className="w-full h-96 overflow-auto bg-gray-700 p-4">{correctionFileContent}</pre>
              ) : (
                <p>Format de fichier non supporté pour l'affichage</p>
              )}
            </div>
            <button 
              className="absolute top-2 right-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              onClick={() => setSelectedDevoir(null)}
            >
              Fermer
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default NoteEtudiant;
