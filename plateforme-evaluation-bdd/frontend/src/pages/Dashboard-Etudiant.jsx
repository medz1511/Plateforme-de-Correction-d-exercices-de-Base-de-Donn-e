import { BarChart2, FileText, Users, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DevoirsStatChart from "../components/overview/DevoirsStatChart";
import NotesMoyenneChart from "../components/overview/NotesMoyenneChart";
import { useTheme } from "../context/ThemeContext";
import ClickableText from "../context/ClickableText";

const VisualisationEtudiant = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`flex-1 overflow-auto relative z-10 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title={
        <ClickableText id="student-dashboard-title" effect="📊" effectDuration={800}>
          Tableau de Bord Étudiant
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
            name={<ClickableText id="assignments-submitted" effect="📝">Devoirs soumis</ClickableText>}
            icon={FileText} 
            value="5" 
            color={darkMode ? "#818cf8" : "#6366F1"}
            darkMode={darkMode}
          />
          <StatCard 
            name={<ClickableText id="assignments-graded" effect="✅">Devoirs corrigés</ClickableText>}
            icon={CheckCircle} 
            value="4" 
            color={darkMode ? "#34d399" : "#10B981"}
            darkMode={darkMode}
          />
          <StatCard 
            name={<ClickableText id="average-grades" effect="📈">Moyenne des notes</ClickableText>}
            icon={BarChart2} 
            value="15.5 / 20" 
            color={darkMode ? "#f472b6" : "#EC4899"}
            darkMode={darkMode}
          />
          <StatCard 
            name={<ClickableText id="pending-assignments" effect="⏳">Devoirs en attente</ClickableText>}
            icon={Users} 
            value="1" 
            color={darkMode ? "#a78bfa" : "#8B5CF6"}
            darkMode={darkMode}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            className={`rounded-lg p-4 transition-all duration-300 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 shadow'}`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <DevoirsStatChart />
          </motion.div>
          
          <motion.div 
            className={`rounded-lg p-4 transition-all duration-300 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 shadow'}`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <NotesMoyenneChart />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default VisualisationEtudiant;