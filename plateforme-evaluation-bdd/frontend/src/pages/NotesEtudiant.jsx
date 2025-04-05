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
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white text-lg">
        Chargement des résultats...
      </div>
    );
  }

  const averageGrade = (
    results.reduce((acc, curr) => acc + curr.grade, 0) / results.length
  ).toFixed(2);

  return (
    <div className="flex-1 overflow-auto bg-gray-900 text-white">
      <Header title="Consultation des Corrections" />

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
            color="#6366F1"
          />
          <StatCard
            name="Moyenne Générale"
            icon={CheckCircle}
            value={averageGrade}
            color="#10B981"
          />
        </motion.div>

        {/* Tableau des notes */}
        <CorrectionTable results={results} />

        {/* Graphe des résultats */}
        <div className="bg-gray-800 p-6 mt-8 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center text-white">
            Répartition des Notes par Matière
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={results} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="subject" stroke="#D1D5DB" />
              <YAxis stroke="#D1D5DB" domain={[0, 20]} />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", borderColor: "#4B5563" }} />
              <Legend />
              <Bar dataKey="grade" fill="#34D399" name="Note Obtenue" />
              <Bar dataKey="maxGrade" fill="#6366F1" name="Note Maximale" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default CorrectionResults;
