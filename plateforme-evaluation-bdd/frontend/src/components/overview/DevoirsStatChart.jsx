import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "@/context/ThemeContext";

// Exemple de données pour les devoirs
const data = [
  { name: "Devoirs soumis", count: 5 },
  { name: "Devoirs corrigés", count: 4 },
  { name: "Devoirs en attente", count: 1 },
];

const DevoirsStatChart = () => {
  const { darkMode } = useTheme();

  // Couleurs dynamiques
  const barColor = darkMode ? "#818cf8" : "#6366F1"; // Indigo plus clair en mode sombre
  const textColor = darkMode ? "#E5E7EB" : "#1F2937"; // Texte clair/sombre
  const gridColor = darkMode ? "#4B5563" : "#E5E7EB"; // Grille plus douce en dark
  const tooltipBg = darkMode ? "#1F2937" : "#FFFFFF"; // Fond tooltip
  const cardBg = darkMode ? "bg-gray-800" : "bg-white"; // Fond de la carte

  return (
    <div className={`${cardBg} p-6 rounded-lg shadow transition-colors duration-300`}>
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Statistiques des Devoirs
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: textColor }}
          />
          <YAxis 
            tick={{ fill: textColor }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg,
              borderColor: darkMode ? "#4B5563" : "#E5E7EB",
              borderRadius: '0.5rem'
            }}
            itemStyle={{ color: textColor }}
          />
          <Legend 
            wrapperStyle={{ color: textColor }}
          />
          <Bar 
            dataKey="count" 
            fill={barColor} 
            radius={[4, 4, 0, 0]} // Coins arrondis en haut seulement
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DevoirsStatChart;