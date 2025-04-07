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

const correctionData = [
  { subject: "Mathématiques", grade: 15, maxGrade: 20 },
  { subject: "Physique", grade: 17, maxGrade: 20 },
  { subject: "Chimie", grade: 13, maxGrade: 20 },
  { subject: "Histoire", grade: 18, maxGrade: 20 },
  { subject: "Anglais", grade: 14, maxGrade: 20 },
];

const CorrectionResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchResults = async () => {
      setTimeout(() => {
        setResults(correctionData);
        setLoading(false);
      }, 1000);
    };
    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} text-lg`}>
        Chargement des résultats...
      </div>
    );
  }

  const averageGrade = (
    results.reduce((acc, curr) => acc + curr.grade, 0) / results.length
  ).toFixed(2);

  return (
    <div className={`flex-1 overflow-auto relative z-10 transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <Header title="Consultation des Corrections" darkMode={darkMode} />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Statistiques */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <StatCard
            name="Total des Matières"
            icon={FileText}
            value={results.length}
            color={darkMode ? "#8183f4" : "#6366F1"}
            darkMode={darkMode}
            textColor={darkMode ? "text-gray-100" : "text-gray-900"}
          />
          <StatCard
            name="Moyenne Générale"
            icon={CheckCircle}
            value={averageGrade}
            color={darkMode ? "#34D399" : "#10B981"}
            darkMode={darkMode}
            textColor={darkMode ? "text-gray-100" : "text-gray-900"}
          />
        </motion.div>

        {/* Tableau des notes */}
        <CorrectionTable results={results} darkMode={darkMode} />

        {/* Graphe des résultats */}
        <div className={`p-6 mt-8 rounded-2xl shadow-lg transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4 text-center ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            Répartition des Notes par Matière
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={results} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#4B5563" : "#E5E7EB"} />
              <XAxis 
                dataKey="subject" 
                stroke={darkMode ? "#D1D5DB" : "#6B7280"} 
                tick={{ fill: darkMode ? "#F3F4F6" : "#374151" }}
              />
              <YAxis 
                stroke={darkMode ? "#D1D5DB" : "#6B7280"} 
                domain={[0, 20]} 
                tick={{ fill: darkMode ? "#F3F4F6" : "#374151" }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? "#1F2937" : "#FFFFFF", 
                  borderColor: darkMode ? "#4B5563" : "#E5E7EB",
                  color: darkMode ? "#F3F4F6" : "#111827"
                }} 
                itemStyle={{ color: darkMode ? "#F3F4F6" : "#111827" }}
                labelStyle={{ color: darkMode ? "#F3F4F6" : "#111827" }}
              />
              <Legend 
                wrapperStyle={{
                  color: darkMode ? "#F3F4F6" : "#111827"
                }}
              />
              <Bar dataKey="grade" fill="#34D399" name="Note Obtenue" />
              <Bar dataKey="maxGrade" fill="#6366F1" name="Note Maximale" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bouton de changement de thème */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-300 ${
              darkMode 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800'
            }`}
          >
            {darkMode ? (
              <>
                <span>Mode Clair</span>
                <span>☀️</span>
              </>
            ) : (
              <>
                <span>Mode Sombre</span>
                <span>🌙</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default CorrectionResults;