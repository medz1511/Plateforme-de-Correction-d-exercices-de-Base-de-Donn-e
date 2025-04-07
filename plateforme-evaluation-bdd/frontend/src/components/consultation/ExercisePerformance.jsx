import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "@/context/ThemeContext";

const ExercisePerformance = ({ loading }) => {
    const { darkMode } = useTheme();
    
    // Mock data
    const data = [
        { name: "Bases SQL", aiAvg: 14.2, profAvg: 14.8 },
        { name: "Normalisation", aiAvg: 12.5, profAvg: 13.1 },
        { name: "Jointures", aiAvg: 11.8, profAvg: 12.3 },
        { name: "Indexation", aiAvg: 13.6, profAvg: 13.2 },
        { name: "Transactions", aiAvg: 10.9, profAvg: 11.5 },
    ];

    // Couleurs dynamiques
    const aiBarColor = darkMode ? '#818cf8' : '#6366f1'; // Indigo
    const profBarColor = darkMode ? '#34d399' : '#10b981'; // Emerald
    const gridColor = darkMode ? '#4b5563' : '#e5e7eb';
    const textColor = darkMode ? '#e5e7eb' : '#374151';
    const tooltipBg = darkMode ? '#1f2937' : '#ffffff';
    const tooltipBorder = darkMode ? '#4b5563' : '#e5e7eb';

    return (
        <motion.div
            className={`rounded-lg shadow-xl overflow-hidden transition-colors duration-300 ${
                darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className={`px-6 py-4 border-b ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
                <h2 className={`text-xl font-semibold ${
                    darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                    Performance des exercices
                </h2>
            </div>

            <div className="p-6 h-80">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className={`inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${
                            darkMode ? 'border-blue-500' : 'border-blue-600'
                        }`}></div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis 
                                dataKey="name" 
                                tick={{ fill: textColor }} 
                                tickMargin={10}
                            />
                            <YAxis 
                                tick={{ fill: textColor }} 
                                domain={[0, 20]} 
                                tickMargin={10}
                            />
                            <Tooltip
                                contentStyle={{ 
                                    backgroundColor: tooltipBg,
                                    borderColor: tooltipBorder,
                                    borderRadius: '0.5rem'
                                }}
                                itemStyle={{ 
                                    color: darkMode ? '#f3f4f6' : '#111827'
                                }}
                            />
                            <Legend 
                                wrapperStyle={{
                                    paddingTop: '20px',
                                    color: textColor
                                }}
                            />
                            <Bar 
                                name="Note IA" 
                                dataKey="aiAvg" 
                                fill={aiBarColor} 
                                barSize={20} 
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar 
                                name="Note professeur" 
                                dataKey="profAvg" 
                                fill={profBarColor} 
                                barSize={20} 
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
};

export default ExercisePerformance;