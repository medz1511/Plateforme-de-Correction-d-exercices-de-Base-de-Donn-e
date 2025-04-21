// src/components/overview/ExercisePerformance.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { Info, BarChart2, Loader2 } from 'lucide-react';
import { fetchExercisePerformance } from '../../services/statisticsService';

const ExercisePerformance = () => {
  const { darkMode } = useTheme();
  const [chartData, setChartData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Couleurs dynamiques
  const colors = {
    aiBar: darkMode ? '#818cf8' : '#6366f1',
    profBar: darkMode ? '#34d399' : '#10b981',
    grid: darkMode ? '#4b5563' : '#e5e7eb',
    text: darkMode ? '#e5e7eb' : '#374151',
    hover: darkMode ? '#a5b4fc' : '#818cf8',
    background: darkMode ? 'bg-gray-800' : 'bg-white',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    headerText: darkMode ? 'text-white' : 'text-gray-800',
    icon: darkMode ? 'text-blue-400' : 'text-blue-600'
  };

  // Récupère les données au montage
  useEffect(() => {
    setIsLoading(true);
     fetchExercisePerformance()
       .then(res => {
         let raw = res.data;
         // si on reçoit un objet, on le wrappe dans un tableau
         const list = Array.isArray(raw) ? raw : [raw];
         // nettoyage / casting
         const clean = list.map(item => ({
           name:      item.name,
           aiAvg:     item.aiAvg != null ? Number(item.aiAvg) : 0,
           profAvg:   item.profAvg != null ? Number(item.profAvg) : 0,
           completion: Number(item.completion) || 0,
           timeAvg:   item.timeAvg != null ? Number(item.timeAvg) : 0
         }));
         setChartData(clean);
       })
       .catch(err => console.error('Erreur fetch perf :', err))
       .finally(() => setIsLoading(false));
     }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const { completion, timeAvg } = payload[0].payload;
    return (
      <div className={`p-4 rounded-lg shadow-lg border ${colors.background} ${colors.border}`}>
        <h3 className="font-bold mb-2">{label}</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-indigo-500 font-medium">IA: {payload[0].value}/20</p>
            <p className="text-emerald-500 font-medium">Prof: {payload[1].value}/20</p>
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>Complétion: {completion}%</p>
            <p>Temps moyen: {timeAvg} min</p>
          </div>
        </div>
      </div>
    );
  };

  const renderLegend = () => (
    <div className="flex justify-center space-x-4 mt-2">
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2" />
        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Note IA</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2" />
        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Note Prof</span>
      </div>
    </div>
  );

  return (
    <motion.div
      className={`rounded-xl shadow-lg overflow-hidden transition-colors duration-300 ${colors.background}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Header */}
      <div className={`px-6 py-4 border-b ${colors.border} flex justify-between items-center`}>
        <div className="flex items-center">
          <BarChart2 className={`mr-3 ${colors.icon}`} size={20} />
          <h2 className={`text-xl font-semibold ${colors.headerText}`}>Performance des exercices</h2>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          <Info size={18} className={colors.icon} />
        </button>
      </div>

      {/* Info */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`px-6 py-3 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} ${darkMode ? 'text-gray-300' : 'text-blue-800'}`}
        >
          <p className="text-sm">
            Comparaison des notes moyennes attribuées par l'IA et le professeur pour chaque exercice.
          </p>
        </motion.div>
      )}

      {/* Chart */}
      <div className="p-6 h-80">
        {isLoading ? (
          <motion.div className="h-full flex flex-col items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Loader2 className={`animate-spin ${colors.icon} mb-2`} size={24} />
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Chargement des données...</p>
          </motion.div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              onMouseMove={state => setActiveIndex(state.activeTooltipIndex)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: colors.text }} axisLine={{ stroke: colors.grid }} />
              <YAxis domain={[0, 20]} tick={{ fill: colors.text }} axisLine={{ stroke: colors.grid }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: darkMode ? 'rgba(75,85,99,0.3)' : 'rgba(229,231,235,0.5)' }} />
              <Legend content={renderLegend} />
              <Bar name="Note IA" dataKey="aiAvg" barSize={24} radius={[4,4,0,0]}>
                {chartData.map((entry, idx) => (
                  <Cell key={`ai-${idx}`} fill={idx === activeIndex ? colors.hover : colors.aiBar} />
                ))}
              </Bar>
              <Bar name="Note Prof" dataKey="profAvg" barSize={24} radius={[4,4,0,0]}>
                {chartData.map((entry, idx) => (
                  <Cell key={`prof-${idx}`} fill={idx === activeIndex ? colors.hover : colors.profBar} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default ExercisePerformance;
