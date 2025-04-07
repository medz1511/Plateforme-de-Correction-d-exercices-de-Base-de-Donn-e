import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useTheme } from "@/context/ThemeContext";

const GradeDistribution = ({ loading }) => {
    const { darkMode } = useTheme();

    // Données avec couleurs dynamiques
    const data = [
        { 
            name: "Excellent (16-20)", 
            value: 32, 
            color: darkMode ? "#34D399" : "#10B981" // Vert
        },
        { 
            name: "Bon (12-16)", 
            value: 45, 
            color: darkMode ? "#818CF8" : "#6366F1" // Indigo
        },
        { 
            name: "Moyen (8-12)", 
            value: 18, 
            color: darkMode ? "#FBBF24" : "#F59E0B" // Orange
        },
        { 
            name: "Faible (0-8)", 
            value: 5, 
            color: darkMode ? "#F87171" : "#EF4444" // Rouge
        },
    ];

    // Styles dynamiques
    const containerClasses = `rounded-lg shadow-xl overflow-hidden transition-colors duration-300 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
    }`;
    const headerClasses = `px-6 py-4 border-b ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
    }`;
    const titleClasses = `text-xl font-semibold ${
        darkMode ? 'text-white' : 'text-gray-800'
    }`;
    const spinnerClasses = `inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${
        darkMode ? 'border-blue-500' : 'border-blue-600'
    }`;

    return (
        <motion.div
            className={containerClasses}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <div className={headerClasses}>
                <h2 className={titleClasses}>Répartition des notes</h2>
            </div>

            <div className="p-6 h-80">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className={spinnerClasses}></div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => (
                                    <text 
                                        fill={darkMode ? "#E5E7EB" : "#1F2937"}
                                        fontSize="12px"
                                    >
                                        {`${name}: ${(percent * 100).toFixed(0)}%`}
                                    </text>
                                )}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                                    borderColor: darkMode ? '#4B5563' : '#E5E7EB',
                                    borderRadius: '0.5rem'
                                }}
                                itemStyle={{ 
                                    color: darkMode ? '#F3F4F6' : '#111827'
                                }}
                                formatter={(value) => [`${value} soumissions`, 'Quantité']}
                            />
                            <Legend 
                                verticalAlign="bottom" 
                                height={36}
                                wrapperStyle={{
                                    color: darkMode ? '#E5E7EB' : '#1F2937'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
};

export default GradeDistribution;