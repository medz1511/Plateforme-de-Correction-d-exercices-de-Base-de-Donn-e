import { CheckCircle, Clock, AlertTriangle, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import GradeDistribution from "../components/consultation/GradeDistribution";
import ExercisePerformance from "../components/consultation/ExercisePerformance";
import SubmissionsTable from "../components/consultation/SubmissionsTable";

const ConsultationNotes = () => {
	const [gradingStats, setGradingStats] = useState({
		totalSubmissions: "0",
		pendingReview: "0",
		reviewedSubmissions: "0",
		averageScore: "0.0",
	});

	const [submissions, setSubmissions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// This would be replaced with your actual API call
		const fetchGradingData = async () => {
			try {
				setLoading(true);
				// Example API call
				// const response = await api.get('/correction-service/professor/stats');
				// setGradingStats(response.data.stats);
				// setSubmissions(response.data.recentSubmissions);

				// Simulate API response for now
				setTimeout(() => {
					setGradingStats({
						totalSubmissions: "124",
						pendingReview: "18",
						reviewedSubmissions: "106",
						averageScore: "14.7",
					});
					setSubmissions([
						{ id: 1, studentName: "Alice Smith", exerciseName: "SQL Joins", submittedAt: "2025-03-30T15:42:00", aiScore: 16.5, professorScore: 17.0, status: "reviewed" },
						{ id: 2, studentName: "Bob Johnson", exerciseName: "Database Normalization", submittedAt: "2025-03-30T14:20:00", aiScore: 12.0, professorScore: null, status: "pending" },
						{ id: 3, studentName: "Charlie Brown", exerciseName: "SQL Joins", submittedAt: "2025-03-29T10:15:00", aiScore: 15.0, professorScore: 14.5, status: "reviewed" },
						// More dummy data
					]);
					setLoading(false);
				}, 1000);
			} catch (error) {
				console.error("Failed to fetch grading data:", error);
				setLoading(false);
			}
		};

		fetchGradingData();
	}, []);

	const handleGradeAdjustment = async (submissionId, adjustedGrade) => {
		try {
			// This would be your actual API call
			// await api.put(`/correction-service/submissions/${submissionId}/grade`, {
			//   adjustedGrade,
			// });

			// Update local state
			setSubmissions(submissions.map(sub => {
				if (sub.id === submissionId) {
					return { ...sub, professorScore: adjustedGrade, status: "reviewed" };
				}
				return sub;
			}));

			// Update stats
			setGradingStats(prev => ({
				...prev,
				pendingReview: (parseInt(prev.pendingReview) - 1).toString(),
				reviewedSubmissions: (parseInt(prev.reviewedSubmissions) + 1).toString(),
			}));

		} catch (error) {
			console.error("Failed to update grade:", error);
		}
	};

	return (
		<div className='flex-1 relative z-10 overflow-auto bg-gray-900'>
			<Header title={"Grading Dashboard"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						name='Total Submissions'
						icon={Award}
						value={gradingStats.totalSubmissions}
						color='#6366F1'
					/>
					<StatCard
						name='Pending Review'
						icon={Clock}
						value={gradingStats.pendingReview}
						color='#F59E0B'
					/>
					<StatCard
						name='Reviewed Submissions'
						icon={CheckCircle}
						value={gradingStats.reviewedSubmissions}
						color='#10B981'
					/>
					<StatCard
						name='Average Score'
						icon={AlertTriangle}
						value={gradingStats.averageScore + "/20"}
						color='#EF4444'
					/>
				</motion.div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
					<ExercisePerformance loading={loading} />
					<GradeDistribution loading={loading} />
				</div>

				<SubmissionsTable
					submissions={submissions}
					loading={loading}
					onGradeAdjust={handleGradeAdjustment}
				/>
			</main>
		</div>
	);
};

export default ConsultationNotes;