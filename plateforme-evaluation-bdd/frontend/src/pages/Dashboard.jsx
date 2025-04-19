import { BarChart2, BookOpen, Users, Award } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import GradeDistribution from "../components/overview/GradeDistribution";
import ExercisePerformance from "../components/overview/ExercisePerformance";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from 'react';
import ClickableText from "../context/ClickableText";
import { fetchOverview } from '../services/statisticsService';

const Dashboard = () => {
  const { darkMode } = useTheme();
    const [stats, setStats] = useState({
      studentCount: 0,
      averageScore: '0.0',
      coursesActive: 0,
      percentExcellent: 0
    });
    const [loadingOverview, setLoadingOverview] = useState(true);
  
    useEffect(() => {
      fetchOverview()
        .then(res => setStats(res.data))
        .catch(err => console.error('Erreur overview :', err))
        .finally(() => setLoadingOverview(false));
    }, []);

  return (
    <div className={`flex-1 overflow-auto relative z-10 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title={
        <ClickableText id="dashboard-title" effect="📊" effectDuration={800}>
          Tableau de Bord Éducatif
        </ClickableText>
      } />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
         {/* Overview StatCards dynamiques */}
         <StatCard
           name="Étudiants"
           icon={Users}
           value={loadingOverview ? '...' : stats.studentCount.toString()}
           color={darkMode ? '#818cf8' : '#6366F1'}
           darkMode={darkMode}
         />
         <StatCard
           name="Moyenne Générale"
           icon={BarChart2}
           value={loadingOverview ? '.../20' : `${stats.averageScore}/20`}
           color={darkMode ? '#34d399' : '#10B981'}
           darkMode={darkMode}
         />
         <StatCard
           name="Sujets Total"
           icon={BookOpen}
           value={loadingOverview ? '...' : stats.coursesActive.toString()}
           color={darkMode ? '#f472b6' : '#EC4899'}
           darkMode={darkMode}
         />
         <StatCard
           name="Mentions Excellent"
           icon={Award}
           value={loadingOverview ? '...%' : `${stats.percentExcellent}%`}
           color={darkMode ? '#fbbf24' : '#F59E0B'}
           darkMode={darkMode}
         />
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <motion.div 
            className={`rounded-lg p-4 transition-all duration-300 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 shadow'}`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <ClickableText id="grade-title" effect="📈" className="block text-lg font-semibold mb-4">
              Répartition des Notes
            </ClickableText>
            <GradeDistribution darkMode={darkMode} />
          </motion.div>
          
          <motion.div 
            className={`rounded-lg p-4 transition-all duration-300 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 shadow'}`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <ClickableText id="exercise-title" effect="📝" className="block text-lg font-semibold mb-4">
              Performance des Exercices
            </ClickableText>
            <ExercisePerformance darkMode={darkMode} />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;