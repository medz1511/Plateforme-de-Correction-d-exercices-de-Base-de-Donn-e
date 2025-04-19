// src/pages/ConsultationNotes.jsx

import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertTriangle, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../components/common/Header';
import StatCard from '../components/common/StatCard';
import SubmissionsTable from '../components/consultation/SubmissionsTable';
import { useTheme } from '../context/ThemeContext';
import {
    fetchSubmissionStats,
  fetchSoumissions,
  updateSoumission,
} from '../services/soumissionService';

const ConsultationNotes = () => {
  const { darkMode } = useTheme();
  const [gradingStats, setGradingStats] = useState({
    totalSubmissions: '0',
    pendingReview: '0',
    reviewedSubmissions: '0',
    averageScore: '0.0',
  });
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const stats = await fetchSubmissionStats();
        setGradingStats({
          totalSubmissions: stats.totalSubmissions.toString(),
          pendingReview: stats.pendingReview.toString(),
          reviewedSubmissions: stats.reviewedSubmissions.toString(),
          averageScore: stats.averageScore.toFixed(1),
        });
        const subs = await fetchSoumissions();
        setSubmissions(subs.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  console.log(submissions);


  

  const handleGradeAdjustment = async (submissionId, adjustedGrade, feedback) => {
    try {
      await updateSoumission(submissionId, {
        note_final: adjustedGrade,
        commentaire_prof: feedback,
      });
      // … mise à jour locale de state existante …
    } catch (err) {
      console.error(err);
    }
      setSubmissions(subs =>
    subs.map(s =>
      s.id === submissionId
        ? { 
            ...s,
            note_final: adjustedGrade,
            feedback: feedback 
          }
        : s
    )
  );
  };

  return (
    <div className={`flex-1 relative z-10 overflow-auto ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    } transition-colors duration-300`}>
      <Header title="Tableau de correction" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Soumissions totales"
            icon={Award}
            value={gradingStats.totalSubmissions}
            color={darkMode ? '#8183f4' : '#6366F1'}
            darkMode={darkMode}
          />
          <StatCard
            name="En attente"
            icon={Clock}
            value={gradingStats.pendingReview}
            color={darkMode ? '#F59E0B' : '#F59E0B'}
            darkMode={darkMode}
          />
          <StatCard
            name="Corrigées"
            icon={CheckCircle}
            value={gradingStats.reviewedSubmissions}
            color={darkMode ? '#34D399' : '#10B981'}
            darkMode={darkMode}
          />
          <StatCard
            name="Moyenne"
            icon={AlertTriangle}
            value={`${gradingStats.averageScore}/20`}
            color={darkMode ? '#EF4444' : '#EF4444'}
            darkMode={darkMode}
          />
        </motion.div>
        <div className={`rounded-lg p-4 ${
          darkMode ? 'bg-gray-800' : 'bg-white shadow'
        }`}>
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
