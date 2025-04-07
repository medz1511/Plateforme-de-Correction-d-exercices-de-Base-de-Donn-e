import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "@/context/ThemeContext";

const categoryData = [
    { name: "Full-Stack", value: 2500 },
    { name: "Frontend", value: 6500 },
    { name: "Backend", value: 2800 },
    { name: "AI / ML", value: 2100 },
    { name: "Data Science", value: 1500 },
    { name: "App Development", value: 1500 },
];

const CategoryDistributionChart = () => {
    const { darkMode } = useTheme();

    // Couleurs dynamiques
    const COLORS = darkMode 
        ? ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"] 
        : ["#4F46E5", "#7C3AED", "#DB2777", "#059669", "#D97706"];

    // Styles dynamiques
    const containerClasses = `backdrop-blur-md shadow-lg rounded-xl p-6 border ${
        darkMode 
            ? 'bg-gray-800 bg-opacity-50 border-gray-700' 
            : 'bg-white bg-opacity-70 border-gray-200'
    }`;
    const titleClasses = `text-lg font-medium mb-4 ${
        darkMode ? 'text-gray-100' : 'text-gray-800'
    }`;

    return (
        <motion.div
            className={containerClasses}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h2 className={titleClasses}>Category Distribution</h2>
            <div className='h-80'>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }) => (
                                <text 
                                    fill={darkMode ? "#E5E7EB" : "#1F2937"} 
                                    fontSize="12px"
                                >
                                    {`${name} ${(percent * 100).toFixed(0)}%`}
                                </text>
                            )}
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: darkMode ? "#111827" : "#FFFFFF",
                                borderColor: darkMode ? "#1F2937" : "#E5E7EB",
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            itemStyle={{ 
                                color: darkMode ? "#F3F4F6" : "#111827"
                            }}
                        />
                        <Legend 
                            wrapperStyle={{
                                color: darkMode ? "#E5E7EB" : "#1F2937"
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default CategoryDistributionChart;