// components/grading/GradeDistribution.jsx
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const GradeDistribution = ({ loading }) => {
    // Mock data - would come from API in real implementation
    const data = [
        { name: "Excellent (16-20)", value: 32, color: "#10B981" },
        { name: "Good (12-16)", value: 45, color: "#6366F1" },
        { name: "Average (8-12)", value: 18, color: "#F59E0B" },
        { name: "Poor (0-8)", value: 5, color: "#EF4444" },
    ];

    return (
        <motion.div
            className="bg-gray-800 rounded-lg shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
            <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Grade Distribution</h2>
            </div>

            <div className="p-6 h-80">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
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
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value} submissions`} />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
};

export default GradeDistribution;