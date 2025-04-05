import { BarChart2, FileText, Users, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DevoirsStatChart from "../components/overview/DevoirsStatChart"; // Un graphique hypothétique sur l'état des devoirs
import NotesMoyenneChart from "../components/overview/NotesMoyenneChart"; // Un graphique sur la moyenne des notes

const VisualisationEtudiant = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
      <Header title="Tableau de Bord Étudiant" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Devoirs soumis" icon={FileText} value="5" color="#6366F1" />
          <StatCard name="Devoirs corrigés" icon={CheckCircle} value="4" color="#10B981" />
          <StatCard name="Moyenne des notes" icon={BarChart2} value="15.5 / 20" color="#EC4899" />
          <StatCard name="Devoirs en attente" icon={Users} value="1" color="#8B5CF6" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DevoirsStatChart /> {/* Graphique pour l'état des devoirs */}
          <NotesMoyenneChart /> {/* Graphique pour la moyenne des notes */}
        </div>
      </main>
    </div>
  );
};

export default VisualisationEtudiant;
