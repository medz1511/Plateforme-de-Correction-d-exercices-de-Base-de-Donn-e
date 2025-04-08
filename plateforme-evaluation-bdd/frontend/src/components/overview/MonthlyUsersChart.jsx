import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area } from "recharts";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import { Users, Info, ChevronUp, ChevronDown } from "lucide-react";

const monthlyUsersData = [
    { name: "Jan", users: 2200, newUsers: 800 },
    { name: "Feb", users: 2900, newUsers: 700 },
    { name: "Mar", users: 3800, newUsers: 900 },
    { name: "Apr", users: 3600, newUsers: 400 },
    { name: "May", users: 1600, newUsers: 200 },
    { name: "Jun", users: 2000, newUsers: 500 },
    { name: "Jul", users: 2200, newUsers: 600 },
    { name: "Aug", users: 3400, newUsers: 1200 },
    { name: "Sep", users: 4400, newUsers: 1000 },
    { name: "Oct", users: 4600, newUsers: 800 },
    { name: "Nov", users: 6200, newUsers: 1600 },
    { name: "Dec", users: 7900, newUsers: 1700 },
];

const MonthlyUsersChart = () => {
    const { darkMode } = useTheme();
    const [showDetails, setShowDetails] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);

    // Dynamic colors based on theme
    const colors = {
        line: darkMode ? '#6aed64' : '#10b981',
        area: darkMode ? 'rgba(106, 237, 100, 0.2)' : 'rgba(16, 185, 129, 0.2)',
        newUsersLine: darkMode ? '#818cf8' : '#6366f1',
        grid: darkMode ? '#4b5563' : '#e5e7eb',
        text: darkMode ? '#e5e7eb' : '#374151',
        tooltipBg: darkMode ? '#1f2937' : '#ffffff',
        tooltipBorder: darkMode ? '#4b5563' : '#e5e7eb',
        background: darkMode ? 'bg-gray-800' : 'bg-white',
        border: darkMode ? 'border-gray-700' : 'border-gray-200',
        headerText: darkMode ? 'text-gray-100' : 'text-gray-800',
        icon: darkMode ? 'text-blue-400' : 'text-blue-600'
    };

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`p-4 rounded-lg shadow-lg border ${colors.tooltipBg} ${colors.border}`}>
                    <h3 className="font-bold mb-2">{label}</h3>
                    <div className="grid gap-2">
                        <p className="flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-2"></span>
                            Total: <span className="font-semibold ml-1">{payload[0].value.toLocaleString()}</span>
                        </p>
                        <p className="flex items-center">
                            <span className="inline-block w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
                            Nouveaux: <span className="font-semibold ml-1">{payload[1].value.toLocaleString()}</span>
                        </p>
                        {payload[0].payload && (
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Taux de croissance: {calculateGrowthRate(label)}%
                            </p>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    // Calculate month-over-month growth rate
    const calculateGrowthRate = (month) => {
        const index = monthlyUsersData.findIndex(item => item.name === month);
        if (index <= 0) return 0;
        const prev = monthlyUsersData[index - 1].users;
        const current = monthlyUsersData[index].users;
        return (((current - prev) / prev) * 100).toFixed(1);
    };

    return (
        <motion.div
            className={`rounded-xl shadow-lg overflow-hidden transition-colors duration-300 ${colors.background} ${colors.border}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.01 }}
        >
            <div className={`px-6 py-4 border-b ${colors.border} flex justify-between items-center`}>
                <div className="flex items-center">
                    <Users className={`mr-3 ${colors.icon}`} size={20} />
                    <h2 className={`text-lg font-medium ${colors.headerText}`}>
                        Utilisateurs actifs mensuels
                    </h2>
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => setShowDetails(!showDetails)}
                        className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                        {showDetails ? (
                            <ChevronUp size={18} className={colors.icon} />
                        ) : (
                            <ChevronDown size={18} className={colors.icon} />
                        )}
                    </button>
                    <button 
                        className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                        <Info size={18} className={colors.icon} />
                    </button>
                </div>
            </div>

            {showDetails && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`px-6 py-3 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} ${darkMode ? 'text-gray-300' : 'text-blue-800'}`}
                >
                    <p className="text-sm">
                        Évolution du nombre total d'utilisateurs actifs et des nouveaux utilisateurs par mois.
                        Les données incluent les utilisateurs uniques ayant interagi avec la plateforme.
                    </p>
                </motion.div>
            )}

            <div className="p-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={monthlyUsersData}
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
                        />
                        <YAxis 
                            tick={{ fill: colors.text }}
                            tickLine={{ stroke: colors.grid }}
                            axisLine={{ stroke: colors.grid }}
                            tickFormatter={(value) => value.toLocaleString()}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: colors.grid, strokeDasharray: "3 3" }}
                        />
                        <Legend 
                            wrapperStyle={{
                                paddingTop: '10px',
                                color: colors.text
                            }}
                            formatter={(value) => (
                                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {value === 'users' ? 'Total' : 'Nouveaux'}
                                </span>
                            )}
                        />
                        <Area
                            type="monotone"
                            dataKey="users"
                            fill={colors.area}
                            stroke="none"
                        />
                        <Line
                            type="monotone"
                            dataKey="users"
                            stroke={colors.line}
                            strokeWidth={3}
                            dot={{
                                fill: colors.line,
                                strokeWidth: 1,
                                r: activeIndex !== null ? 0 : 4,
                                opacity: 0.8
                            }}
                            activeDot={{
                                r: 8,
                                stroke: colors.line,
                                strokeWidth: 2,
                                fill: darkMode ? '#1f2937' : '#ffffff'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="newUsers"
                            stroke={colors.newUsersLine}
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{
                                fill: colors.newUsersLine,
                                strokeWidth: 1,
                                r: activeIndex !== null ? 0 : 3,
                                opacity: 0.8
                            }}
                            activeDot={{
                                r: 6,
                                stroke: colors.newUsersLine,
                                strokeWidth: 2,
                                fill: darkMode ? '#1f2937' : '#ffffff'
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default MonthlyUsersChart;