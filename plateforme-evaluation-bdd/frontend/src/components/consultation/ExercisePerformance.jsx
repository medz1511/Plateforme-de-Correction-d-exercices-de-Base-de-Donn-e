import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { Info, BarChart2, Loader2 } from "lucide-react";

const ExercisePerformance = ({ loading = false }) => {
    const { darkMode } = useTheme();
    const [activeIndex, setActiveIndex] = useState(null);
    
    // Mock data with additional details
    const data = [
        { name: "Bases SQL", aiAvg: 14.2, profAvg: 14.8, students: 24, attempts: 3.2 },
        { name: "Normalisation", aiAvg: 12.5, profAvg: 13.1, students: 18, attempts: 2.8 },
        { name: "Jointures", aiAvg: 11.8, profAvg: 12.3, students: 22, attempts: 3.5 },
        { name: "Indexation", aiAvg: 13.6, profAvg: 13.2, students: 15, attempts: 2.1 },
        { name: "Transactions", aiAvg: 10.9, profAvg: 11.5, students: 20, attempts: 3.0 },
    ];

    // Couleurs dynamiques
    const colors = {
        aiBar: darkMode ? '#818cf8' : '#6366f1', // Indigo
        profBar: darkMode ? '#34d399' : '#10b981', // Emerald
        grid: darkMode ? '#4b5563' : '#e5e7eb',
        text: darkMode ? '#e5e7eb' : '#374151',
        tooltipBg: darkMode ? '#1f2937' : '#ffffff',
        tooltipBorder: darkMode ? '#4b5563' : '#e5e7eb',
        hover: darkMode ? '#a5b4fc' : '#818cf8',
    };

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`p-4 rounded-lg shadow-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h3 className="font-bold mb-2">{label}</h3>
                    <div className="space-y-1">
                        <p className="flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
                            IA: <span className="font-semibold ml-1">{payload[0].value}/20</span>
                        </p>
                        <p className="flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
                            Professeur: <span className="font-semibold ml-1">{payload[1].value}/20</span>
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {payload[0].payload.students} étudiants • {payload[0].payload.attempts} tentatives moy.
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    // Custom Legend
    const renderLegend = (props) => {
        const { payload } = props;
        return (
            <div className="flex justify-center space-x-6 pt-4">
                {payload.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                        <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <motion.div
            className={`rounded-xl shadow-lg overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.01 }}
        >
            <div className={`px-6 py-4 border-b flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center">
                    <BarChart2 className={`mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={20} />
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        Performance des exercices
                    </h2>
                </div>
                <button className={`p-1 rounded-full ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                    <Info size={18} />
                </button>
            </div>

            <div className="p-6 h-80">
                {loading ? (
                    <motion.div 
                        className="h-full flex flex-col items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Loader2 className={`animate-spin ${darkMode ? 'text-blue-500' : 'text-blue-600'} mb-2`} size={24} />
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Chargement des données...</p>
                    </motion.div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                            onMouseMove={(state) => {
                                if (state.isTooltipActive) {
                                    setActiveIndex(state.activeTooltipIndex);
                                } else {
                                    setActiveIndex(null);
                                }
                            }}
                        >
                            <CartesianGrid 
                                strokeDasharray="3 3" 
                                stroke={colors.grid} 
                                vertical={false}
                            />
                            <XAxis 
                                dataKey="name" 
                                tick={{ fill: colors.text }}
                                tickLine={{ stroke: colors.grid }}
                                axisLine={{ stroke: colors.grid }}
                                tickMargin={10}
                            />
                            <YAxis 
                                domain={[0, 20]} 
                                tick={{ fill: colors.text }}
                                tickLine={{ stroke: colors.grid }}
                                axisLine={{ stroke: colors.grid }}
                                tickMargin={10}
                                tickFormatter={(value) => `${value}/20`}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: darkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.5)' }}
                            />
                            <Legend content={renderLegend} />
                            <Bar 
                                name="Note IA" 
                                dataKey="aiAvg" 
                                barSize={24}
                                radius={[4, 4, 0, 0]}
                            >
                                {data.map((entry, index) => (
                                    <Cell 
                                        key={`cell-ai-${index}`}
                                        fill={index === activeIndex ? colors.hover : colors.aiBar}
                                        opacity={index === activeIndex ? 1 : 0.9}
                                    />
                                ))}
                            </Bar>
                            <Bar 
                                name="Note professeur" 
                                dataKey="profAvg" 
                                barSize={24}
                                radius={[4, 4, 0, 0]}
                            >
                                {data.map((entry, index) => (
                                    <Cell 
                                        key={`cell-prof-${index}`}
                                        fill={index === activeIndex ? colors.hover : colors.profBar}
                                        opacity={index === activeIndex ? 1 : 0.9}
                                    />
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
//cv