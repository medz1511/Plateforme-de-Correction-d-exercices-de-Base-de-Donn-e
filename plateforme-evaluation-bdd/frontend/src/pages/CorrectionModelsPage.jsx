import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { FileText, PlusCircle, Edit, FilePlus, CheckCircle } from "lucide-react";
import { useState } from "react";
import CorrectionModelForm from "../components/correction/CorrectionModelForm";
import CorrectionModelsTable from "../components/correction/CorrectionModelsTable";

const CorrectionModelsPage = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);

    // ✅ Mise à jour des statistiques pour correspondre à StatCard
    const stats = [
        {
            name: "Total des modèles",
            value: "42",
            icon: FileText,  // ✅ Correction ici (on enlève <FileText size={24} />)
            color: "#4A90E2", // ✅ Ajout d'une couleur
        },
        {
            name: "Exercices couverts",
            value: "15",
            icon: CheckCircle,
            color: "#2ECC71",
        },
        {
            name: "Modèles en attente",
            value: "7",
            icon: Edit,
            color: "#F39C12",
        },
        {
            name: "Taux d'utilisation",
            value: "89%",
            icon: FilePlus,
            color: "#9B59B6",
        },
    ];

    const handleAddNewModel = () => {
        setShowAddModal(true);
    };

    const handleSelectExercise = (exercise) => {
        setSelectedExercise(exercise);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 w-full"
        >
            <Header
                title="Modèles de correction"
                description="Gérez les modèles de correction pour vos exercices"
                actions={
                    <button
                        onClick={handleAddNewModel}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                        <PlusCircle size={18} />
                        Ajouter un modèle
                    </button>
                }
            />

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        name={stat.name}  // ✅ Correction ici (remplace title par name)
                        value={stat.value}
                        icon={stat.icon}  // ✅ Correction ici (on passe la fonction et non un élément JSX)
                        color={stat.color} // ✅ Ajout de la couleur
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="mt-8 grid grid-cols-1 gap-6">
                {/* Tableau des modèles de correction existants */}
                <div className="bg-gray-800 rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4">Modèles de correction par exercice</h2>
                    <CorrectionModelsTable
                        onSelectExercise={handleSelectExercise}
                    />
                </div>
            </div>

            {/* Modal pour ajouter un nouveau modèle de correction */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl p-6 w-full max-w-3xl">
                        <h2 className="text-xl font-semibold mb-4">
                            {selectedExercise
                                ? `Ajouter un modèle pour l'exercice: ${selectedExercise.title}`
                                : "Ajouter un nouveau modèle de correction"}
                        </h2>
                        <CorrectionModelForm
                            onClose={() => {
                                setShowAddModal(false);
                                setSelectedExercise(null);
                            }}
                            exerciseId={selectedExercise?.id}
                        />
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default CorrectionModelsPage;

// simulation 1 