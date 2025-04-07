import { BarChart2, BookOpen, Users, Award } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import GradeDistribution from "../components/overview/GradeDistribution";
import ExercisePerformance from "../components/overview/ExercisePerformance";
import { useTheme } from "../context/ThemeContext";
import ClickableText from "../context/ClickableText";

const Dashboard = () => {
  const { darkMode } = useTheme();

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
          <StatCard 
            name={<ClickableText id="students-title" effect="👥">Étudiants</ClickableText>}
            icon={Users} 
            value='248' 
            color={darkMode ? '#818cf8' : '#6366F1'}
            darkMode={darkMode}
          />
          <StatCard 
            name={<ClickableText id="average-title" effect="📊">Moyenne Générale</ClickableText>}
            icon={BarChart2} 
            value='14.2/20' 
            color={darkMode ? '#34d399' : '#10B981'}
            darkMode={darkMode}
          />
          <StatCard 
            name={<ClickableText id="courses-title" effect="📚">Cours Actifs</ClickableText>}
            icon={BookOpen} 
            value='18' 
            color={darkMode ? '#f472b6' : '#EC4899'}
            darkMode={darkMode}
          />
          <StatCard 
            name={<ClickableText id="excellence-title" effect="🏆">Mentions Excellent</ClickableText>}
            icon={Award} 
            value='32%' 
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