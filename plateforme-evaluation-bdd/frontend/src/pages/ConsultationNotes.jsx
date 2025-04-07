import { CheckCircle, Clock, AlertTriangle, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SubmissionsTable from "../components/consultation/SubmissionsTable";
import { useTheme } from "../context/ThemeContext";

const ConsultationNotes = () => {
    const { darkMode } = useTheme();
    const [gradingStats, setGradingStats] = useState({
        totalSubmissions: "0",
        pendingReview: "0",
        reviewedSubmissions: "0",
        averageScore: "0.0",
    });

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGradingData = async () => {
            try {
                setLoading(true);
                setTimeout(() => {
                    setGradingStats({
                        totalSubmissions: "124",
                        pendingReview: "18",
                        reviewedSubmissions: "106",
                        averageScore: "14.7",
                    });
                    setSubmissions([
                        { id: 1, studentName: "Alice Smith", exerciseName: "Jointures SQL", submittedAt: "2025-03-30T15:42:00", aiScore: 16.5, professorScore: 17.0, status: "reviewed" },
                        { id: 2, studentName: "Bob Johnson", exerciseName: "Normalisation BDD", submittedAt: "2025-03-30T14:20:00", aiScore: 12.0, professorScore: null, status: "pending" },
                        { id: 3, studentName: "Charlie Brown", exerciseName: "Jointures SQL", submittedAt: "2025-03-29T10:15:00", aiScore: 15.0, professorScore: 14.5, status: "reviewed" },
                    ]);
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Échec de récupération des données:", error);
                setLoading(false);
            }
        };

        fetchGradingData();
    }, []);

    const handleGradeAdjustment = async (submissionId, adjustedGrade, feedback) => {
        try {
            setSubmissions(submissions.map(sub => {
                if (sub.id === submissionId) {
                    return { 
                        ...sub, 
                        professorScore: adjustedGrade, 
                        feedback: feedback,
                        status: "reviewed" 
                    };
                }
                return sub;
            }));
            
            const submissionToUpdate = submissions.find(sub => sub.id === submissionId);
            if (submissionToUpdate && submissionToUpdate.status !== "reviewed") {
                setGradingStats(prev => ({
                    ...prev,
                    pendingReview: (parseInt(prev.pendingReview) - 1).toString(),
                    reviewedSubmissions: (parseInt(prev.reviewedSubmissions) + 1).toString(),
                }));
            }
        } catch (error) {
            console.error("Échec de mise à jour de la note:", error);
        }
    };

    return (
        <div className={`flex-1 relative z-10 overflow-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
            <Header title={"Tableau de correction"} />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <motion.div
                    className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard
                        name='Soumissions totales'
                        icon={Award}
                        value={gradingStats.totalSubmissions}
                        color={darkMode ? "#8183f4" : "#6366F1"}
                        darkMode={darkMode}
                    />
                    <StatCard
                        name='En attente'
                        icon={Clock}
                        value={gradingStats.pendingReview}
                        color={darkMode ? "#F59E0B" : "#F59E0B"}
                        darkMode={darkMode}
                    />
                    <StatCard
                        name='Corrigées'
                        icon={CheckCircle}
                        value={gradingStats.reviewedSubmissions}
                        color={darkMode ? "#34D399" : "#10B981"}
                        darkMode={darkMode}
                    />
                    <StatCard
                        name='Moyenne'
                        icon={AlertTriangle}
                        value={gradingStats.averageScore + "/20"}
                        color={darkMode ? "#EF4444" : "#EF4444"}
                        darkMode={darkMode}
                    />
                </motion.div>

                <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
                    <SubmissionsTable
                        submissions={submissions}
                        loading={loading}
                        onGradeAdjust={handleGradeAdjustment}
                        darkMode={darkMode}
                    />
                </div>
            </main>
        </div>
    );
};

export default ConsultationNotes;