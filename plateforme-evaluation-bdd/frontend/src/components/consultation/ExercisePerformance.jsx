// components/grading/ExercisePerformance.jsx
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ExercisePerformance = ({ loading }) => {
    // Mock data - would come from API in real implementation
    const data = [
        { name: "SQL Basics", aiAvg: 14.2, profAvg: 14.8 },
        { name: "Normalization", aiAvg: 12.5, profAvg: 13.1 },
        { name: "Joins", aiAvg: 11.8, profAvg: 12.3 },
        { name: "Indexing", aiAvg: 13.6, profAvg: 13.2 },
        { name: "Transactions", aiAvg: 10.9, profAvg: 11.5 },
    ];

    return (
        <motion.div
            className="bg-gray-800 rounded-lg shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Exercise Performance</h2>
            </div>

            <div className="p-6 h-80">
                {loading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" tick={{ fill: '#ccc' }} />
                            <YAxis tick={{ fill: '#ccc' }} domain={[0, 20]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#374151', borderColor: '#4B5563' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar name="AI Score" dataKey="aiAvg" fill="#6366F1" barSize={20} />
                            <Bar name="Professor Score" dataKey="profAvg" fill="#10B981" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
};

export default ExercisePerformance;