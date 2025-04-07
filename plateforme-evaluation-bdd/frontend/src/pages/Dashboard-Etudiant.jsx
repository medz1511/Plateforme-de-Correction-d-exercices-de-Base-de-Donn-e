import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import GradeDistribution from "../components/overview/GradeDistribution";
import ExercisePerformance from "../components/overview/ExercisePerformance";
import { useTheme } from "../context/ThemeContext";

const Visualisation = () => {
    const { darkMode } = useTheme();

    return (
        <div className={`flex-1 overflow-auto relative z-10 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
            <Header title='Dashboard Étudiant' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard 
                        name='Total Sujets' 
                        icon={Zap} 
                        value='25' 
                        color={darkMode ? "#8183f4" : "#6366F1"}
                        darkMode={darkMode}
                    />
                    <StatCard 
                        name='À rendre' 
                        icon={ShoppingBag} 
                        value='3' 
                        color={darkMode ? "#8B5CF6" : "#8B5CF6"}
                        darkMode={darkMode}
                    />
                    <StatCard 
                        name='Rendus' 
                        icon={Users} 
                        value='22' 
                        color={darkMode ? "#EC4899" : "#EC4899"}
                        darkMode={darkMode}
                    />
                    <StatCard 
                        name='Moyenne' 
                        icon={BarChart2} 
                        value='14.5/20' 
                        color={darkMode ? "#10B981" : "#10B981"}
                        darkMode={darkMode}
                    />
                </motion.div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
                        <GradeDistribution darkMode={darkMode} />
                    </div>
                    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
                        <ExercisePerformance darkMode={darkMode} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Visualisation;