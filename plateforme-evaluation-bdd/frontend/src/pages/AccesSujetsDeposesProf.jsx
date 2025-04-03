import { motion } from "framer-motion";
import { FileText, CheckCircle } from "lucide-react";
import { useState } from "react";
import Header from "../components/common/Header";  // Assure-toi que ce chemin est correct
import StatCard from "../components/common/StatCard";  // Assure-toi que ce chemin est correct
import SubjectsModelsTable from "../components/sujets/subjectsModelsTable";  // Assure-toi que ce chemin est correct

const AccesSujetsDeposesEtudiant = () => {
    const subjectStats = {
        totalSubjects: 25,
        newSubjectsToday: 3,
        submittedSubjects: 20,  // Changer pour refléter les soumissions des étudiants
    };

    // Date de clôture des dépôts (format: YYYY-MM-DD)
    const deadlineDate = new Date("2025-05-01"); // Exemple : 1er mai 2025

    // Vérification si la date actuelle est après la date de clôture
    const isDeadlinePassed = new Date() > deadlineDate;

    return (
        <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
            <Header title="Accès aux Sujets Déposés" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                {/* Animation pour les statistiques */}
                <motion.div
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard
                        name="Total Sujets"
                        icon={FileText}
                        value={subjectStats.totalSubjects}
                        color="#6366F1"
                    />
                    <StatCard
                        name="Nouveaux Sujets Aujourd'hui"
                        icon={CheckCircle}
                        value={subjectStats.newSubjectsToday}
                        color="#10B981"
                    />
                    <StatCard
                        name="Sujets Soumis"
                        icon={CheckCircle}
                        value={subjectStats.submittedSubjects}
                        color="#F59E0B"
                    />
                </motion.div>

                {/* Tableau des sujets déposés */}
                <SubjectsModelsTable />

                {/* Afficher un message si la date de clôture est atteinte */}
                {isDeadlinePassed && (
                    <div className="mt-4 text-red-500">
                        La date de clôture des dépôts est passée. Vous ne pouvez plus soumettre de nouveaux devoirs.
                    </div>
                )}
            </main>
        </div>
    );
};

export default AccesSujetsDeposesEtudiant;
