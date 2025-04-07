import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from "recharts";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { Award, Loader2, ChevronUp, ChevronDown } from "lucide-react";

const GradeDistribution = ({ loading = false }) => {
    const { darkMode } = useTheme();
    const [activeIndex, setActiveIndex] = useState(null);
    const [showInfo, setShowInfo] = useState(false);

    // Données avec couleurs adaptées au thème
    const data = [
        { 
            name: "Excellent (16-20)", 
            value: 32, 
            color: darkMode ? "#34d399" : "#10b981",
            description: "Performances exceptionnelles"
        },
        { 
            name: "Bon (12-16)", 
            value: 45, 
            color: darkMode ? "#818cf8" : "#6366f1",
            description: "Bonnes compétences maîtrisées"
        },
        { 
            name: "Moyen (8-12)", 
            value: 18, 
            color: darkMode ? "#fbbf24" : "#f59e0b",
            description: "Compétences partiellement acquises"
        },
        { 
            name: "Faible (0-8)", 
            value: 5, 
            color: darkMode ? "#f87171" : "#ef4444",
            description: "Besoins de remédiation"
        },
    ];

    // Styles dynamiques
    const containerClasses = `rounded-xl shadow-lg overflow-hidden transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border`;

    // Active shape pour le secteur survolé
    const renderActiveShape = (props) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
        
        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 10}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
                <text 
                    x={cx} 
                    y={cy} 
                    dy={-20} 
                    textAnchor="middle" 
                    fill={darkMode ? "#f3f4f6" : "#111827"}
                    fontSize={14}
                    fontWeight={600}
                >
                    {payload.name}
                </text>
                <text 
                    x={cx} 
                    y={cy} 
                    dy={5} 
                    textAnchor="middle" 
                    fill={darkMode ? "#d1d5db" : "#6b7280"}
                    fontSize={12}
                >
                    {payload.value} étudiants
                </text>
            </g>
        );
    };

    // Custom Tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`p-4 rounded-lg shadow-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                }`}>
                    <h3 className="font-bold">{payload[0].name}</h3>
                    <p className="mt-1">{payload[0].payload.description}</p>
                    <p className={`mt-2 font-semibold ${
                        darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                        {payload[0].value} étudiants ({(payload[0].payload.percent * 100).toFixed(1)}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom Legend
    const renderCustomLegend = (props) => {
        const { payload } = props;
        return (
            <div className="flex flex-wrap justify-center gap-3 mt-4">
                {payload.map((entry, index) => (
                    <div 
                        key={`legend-${index}`} 
                        className={`flex items-center px-3 py-1 rounded-full ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}
                    >
                        <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <motion.div
            className={containerClasses}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.01 }}
        >
            <div className={`px-6 py-4 border-b ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
            } flex justify-between items-center`}>
                <div className="flex items-center">
                    <Award className={`mr-3 ${
                        darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`} size={20} />
                    <h2 className={`text-xl font-semibold ${
                        darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                        Répartition des notes
                    </h2>
                </div>
                <button 
                    onClick={() => setShowInfo(!showInfo)}
                    className={`p-1 rounded-full ${
                        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                >
                    {showInfo ? (
                        <ChevronUp size={18} className={
                            darkMode ? "text-blue-400" : "text-blue-600"
                        } />
                    ) : (
                        <ChevronDown size={18} className={
                            darkMode ? "text-blue-400" : "text-blue-600"
                        } />
                    )}
                </button>
            </div>

            {showInfo && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`px-6 py-3 ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-800'
                    }`}
                >
                    <p className="text-sm">
                        Distribution des étudiants par fourchette de notes. Les pourcentages représentent 
                        la proportion de chaque catégorie par rapport au total des évaluations.
                    </p>
                </motion.div>
            )}

            <div className="p-6 h-80">
                {loading ? (
                    <motion.div 
                        className="h-full flex flex-col items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Loader2 className={`animate-spin ${
                            darkMode ? 'text-blue-500' : 'text-blue-600'
                        } mb-2`} size={24} />
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                            Chargement des données...
                        </p>
                    </motion.div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                onMouseEnter={(_, index) => setActiveIndex(index)}
                                onMouseLeave={() => setActiveIndex(null)}
                            >
                                {data.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={entry.color} 
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={renderCustomLegend} />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
};

export default GradeDistribution;