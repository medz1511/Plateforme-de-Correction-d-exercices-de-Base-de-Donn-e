import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import GradeDistribution from "../components/overview/GradeDistribution";
import ExercisePerformance from "../components/overview/ExercisePerformance";
import { useTheme } from "../context/ThemeContext";
import ClickableText from "../context/ClickableText";

const Dashboard = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className={`flex-1 overflow-auto relative z-10 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header title={
        <ClickableText id="dashboard-title" effect="📊" effectDuration={800}>
          Dashboard
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
            name={<ClickableText id="sales-title" effect="💰">Total Sales</ClickableText>}
            icon={Zap} 
            value='&#8377; 1,12,345' 
            color={darkMode ? '#8183f4' : '#6366F1'}
            darkMode={darkMode}
          />
          <StatCard 
            name={<ClickableText id="users-title" effect="👥">New Users</ClickableText>}
            icon={Users} 
            value='192' 
            color={darkMode ? '#9d7cf7' : '#8B5CF6'}
            darkMode={darkMode}
          />
          <StatCard 
            name={<ClickableText id="courses-title" effect="📚">Total Courses</ClickableText>}
            icon={ShoppingBag} 
            value='12' 
            color={darkMode ? '#F472B6' : '#EC4899'}
            darkMode={darkMode}
          />
          <StatCard 
            name={<ClickableText id="active-title" effect="🔥">Users Active Now</ClickableText>}
            icon={BarChart2} 
            value='52.5%' 
            color={darkMode ? '#34D399' : '#10B981'}
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
              Grade Distribution
            </ClickableText>
            <GradeDistribution darkMode={darkMode} />
          </motion.div>
          
          <motion.div 
            className={`rounded-lg p-4 transition-all duration-300 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 shadow'}`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <ClickableText id="exercise-title" effect="💪" className="block text-lg font-semibold mb-4">
              Exercise Performance
            </ClickableText>
            <ExercisePerformance darkMode={darkMode} />
          </motion.div>
        </div>

        
      </main>
    </div>
  );
};

export default Dashboard;