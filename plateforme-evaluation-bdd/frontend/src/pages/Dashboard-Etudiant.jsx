// src/pages/dashboard-etudiant.jsx
const user = JSON.parse(localStorage.getItem("user"));
import React, { useState, useEffect } from "react";
import { BarChart2, FileText, Users, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { useTheme } from "../context/ThemeContext";
import ClickableText from "../context/ClickableText";
import API from "../services/api";
import { fetchSoumissionsByEtu } from "../services/soumissionService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer as RechartsResponsiveContainer,
  LineChart,
  Line,
} from "recharts";


const Visualisation = () => {
  const { darkMode } = useTheme();
  const [soumissions, setSoumissions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchSoumissionsByEtu(user.id);
        console.log('soumissions fetched:', response.data);
        setSoumissions(response.data);
      } catch (err) {
        console.error('Erreur chargement soumissions:', err.message);
        setError(err.message);
      }
    };
    if (user.id) load();
  }, [user.id]);
  console.log(soumissions);

  // Statistiques de soumissions
  const totalSoumis = soumissions.length;
  const totalCorriges = soumissions.filter(s => s.etat === 'CORRIGE').length;
  const totalEnAttente = soumissions.filter(s => s.etat !== 'CORRIGE').length;

  // Calcul de la moyenne à partir des notes finales
  const finalGrades = soumissions
    .map(s => s.note_final)
    .filter(n => typeof n === 'number');
  const averageGrade = finalGrades.length
    ? (finalGrades.reduce((a, b) => a + b, 0) / finalGrades.length).toFixed(2)
    : '0';
  console.log('finalGrades:', finalGrades, 'averageGrade:', averageGrade);

  // Données pour le diagramme de statut
  const statusCounts = soumissions.reduce((acc, s) => {
    const key = s.etat === 'CORRIGE' ? 'Corrigés' : s.etat === 'SOUMIS' ? 'Soumis' : 'En attente';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Données pour l'évolution des notes
  const grouped = soumissions.reduce((acc, s) => {
    const date = new Date(s.date_soumission).toLocaleDateString('fr-FR');
    const note = s.note_final;
    if (typeof note === 'number') {
      if (!acc[date]) acc[date] = { sum: 0, count: 0 };
      acc[date].sum += note;
      acc[date].count += 1;
    }
    return acc;
  }, {});
  const evolutionData = Object.entries(grouped)
    .map(([date, { sum, count }]) => ({ date, moyenne: +(sum / count).toFixed(2) }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className={`flex-1 overflow-auto transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header
        title={
          <ClickableText id="student-dashboard-title" effect="📊" effectDuration={800}>
            Tableau de Bord Étudiant
          </ClickableText>
        }
      />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* Afficher l'erreur si présente */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
            Erreur: {typeof error === 'string' ? error : JSON.stringify(error)}
          </div>
        )}

        {/* StatCards */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
        >
          <StatCard
            name={<ClickableText effect="📝">Devoirs soumis</ClickableText>}
            icon={FileText}
            value={totalSoumis}
            color={darkMode ? '#818cf8' : '#6366F1'}
            darkMode={darkMode}
          />
          <StatCard
            name={<ClickableText effect="✅">Devoirs corrigés</ClickableText>}
            icon={CheckCircle}
            value={totalCorriges}
            color={darkMode ? '#34d399' : '#10B981'}
            darkMode={darkMode}
          />
          <StatCard
            name={<ClickableText effect="📈">Moyenne des notes</ClickableText>}
            icon={BarChart2}
            value={`${averageGrade} / 20`}
            color={darkMode ? '#f472b6' : '#EC4899'}
            darkMode={darkMode}
          />
          <StatCard
            name={<ClickableText effect="⏳">Devoirs en attente</ClickableText>}
            icon={Users}
            value={totalEnAttente}
            color={darkMode ? '#a78bfa' : '#8B5CF6'}
            darkMode={darkMode}
          />
        </motion.div>

        {/* Diagrammes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white shadow hover:bg-gray-50'}`}>        
            <h3 className="mb-2 font-semibold">Répartition des statuts</h3>
            <RechartsResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData} margin={{ top: 20, right: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <RechartsTooltip />
                <Bar dataKey="value" fill={darkMode ? '#6366F1' : '#4F46E5'} />
              </BarChart>
            </RechartsResponsiveContainer>
          </div>

          <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white shadow hover:bg-gray-50'}`}>        
            <h3 className="mb-2 font-semibold">Évolution de la moyenne</h3>
            <RechartsResponsiveContainer width="100%" height={300}>
              <LineChart data={evolutionData} margin={{ top: 20, right: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 20]} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="moyenne" stroke={darkMode ? '#34d399' : '#10B981'} strokeWidth={2} />
              </LineChart>
            </RechartsResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Visualisation;
