import { CheckCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import CorrectionTable from "../components/correction/CorrectionTable"; // Nouveau composant pour la table des résultats
import CorrectionChart from "../components/correction/CorrectionChart"; // Graphiques des résultats

// Exemple de données de correction
const correctionData = [
  { subject: 'Mathématiques', grade: 15, maxGrade: 20 },
  { subject: 'Physique', grade: 17, maxGrade: 20 },
  { subject: 'Chimie', grade: 13, maxGrade: 20 },
  { subject: 'Histoire', grade: 18, maxGrade: 20 },
  { subject: 'Anglais', grade: 14, maxGrade: 20 },
];

const CorrectionResults = () => {
  const [results, setResults] = useState(correctionData); // Initialisation des résultats de correction
  const [loading, setLoading] = useState(true); // Gestion du chargement

  useEffect(() => {
    // Simuler la récupération des résultats des corrections
    const fetchResults = async () => {
      // Remplacer par un appel réel à votre backend
      setTimeout(() => {
        setResults(correctionData); // Charger les données des corrections
        setLoading(false);
      }, 1500);
    };

    fetchResults();
  }, []);

  if (loading) return <p>Chargement des résultats...</p>; // Afficher un message pendant le chargement

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
      <Header title="Consultation des Corrections" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Affichage des cartes de statistiques */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Subjects"
            icon={FileText}
            value={results.length}
            color="#6366F1"
          />
          <StatCard
            name="Average Grade"
            icon={CheckCircle}
            value={(results.reduce((acc, curr) => acc + curr.grade, 0) / results.length).toFixed(2)}
            color="#10B981"
          />
        </motion.div>

        {/* Tableau des résultats */}
        <CorrectionTable results={results} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Graphique de la répartition des notes */}
          <CorrectionChart results={results} />
        </div>
      </main>
    </div>
  );
};

export default CorrectionResults;
