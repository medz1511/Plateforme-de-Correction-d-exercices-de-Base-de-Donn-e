import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { FileText, PlusCircle, Edit, CheckCircle, X, Eye, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import CorrectionModelForm from "../components/correction/CorrectionModelForm";
import { useTheme } from "../context/ThemeContext";

const CorrectionModelsPage = () => {
    const { darkMode, toggleTheme } = useTheme();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showPdfViewer, setShowPdfViewer] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [models, setModels] = useState([]);

    useEffect(() => {
        const dummyModels = [
            { id: 1, exerciseTitle: "Exercice 1", status: "Actif", lastUpdate: "2025-04-01", pdfUrl: "/models/model1.pdf" },
            { id: 2, exerciseTitle: "Exercice 2", status: "En attente", lastUpdate: "2025-03-28", pdfUrl: "/models/model2.pdf" },
            { id: 3, exerciseTitle: "Exercice 3", status: "Actif", lastUpdate: "2025-03-15", pdfUrl: "/models/model3.pdf" },
        ];
        setModels(dummyModels);
    }, []);

    const stats = [
        {
            name: "Total des modèles",
            value: models.length.toString(),
            icon: FileText,
            color: darkMode ? "#8183f4" : "#6366F1",
            textColor: darkMode ? "text-gray-100" : "text-gray-900"
        },
        {
            name: "Exercices couverts",
            value: [...new Set(models.map(model => model.exerciseTitle))].length.toString(),
            icon: CheckCircle,
            color: darkMode ? "#34D399" : "#10B981",
            textColor: darkMode ? "text-gray-100" : "text-gray-900"
        },
        {
            name: "Modèles actifs",
            value: models.filter(model => model.status === "Actif").length.toString(),
            icon: CheckCircle,
            color: darkMode ? "#34D399" : "#10B981",
            textColor: darkMode ? "text-gray-100" : "text-gray-900"
        },
    ];

    const handleAddNewModel = () => {
        setSelectedExercise(null);
        setShowAddModal(true);
    };

    const handleEditModel = (model) => {
        setSelectedExercise({ id: model.id, title: model.exerciseTitle });
        setShowAddModal(true);
    };

    const handleDeleteModel = (modelId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce modèle de correction ?")) {
            setModels(models.filter(model => model.id !== modelId));
        }
    };

    const handleViewPdf = (model) => {
        setSelectedPdf(model);
        setShowPdfViewer(true);
    };

    const handleSubmitModel = (modelData) => {
        if (selectedExercise && models.some(m => m.id === selectedExercise.id)) {
            setModels(models.map(model => 
                model.id === selectedExercise.id ? { ...model, ...modelData } : model
            ));
        } else {
            setModels([...models, { 
                id: models.length + 1, 
                exerciseTitle: selectedExercise?.title || modelData.exerciseTitle || "Nouvel exercice",
                status: "En attente",
                lastUpdate: new Date().toISOString().split('T')[0],
                pdfUrl: modelData.pdfUrl || "/models/default.pdf",
                ...modelData
            }]);
        }
        setShowAddModal(false);
        setSelectedExercise(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-6 w-full min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}
        >
            <Header title="Modèles de correction" darkMode={darkMode}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-300 ${
                            darkMode 
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                                : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800'
                        }`}
                    >
                        {darkMode ? (
                            <>
                                <span>Mode Clair</span>
                                <span>☀️</span>
                            </>
                        ) : (
                            <>
                                <span>Mode Sombre</span>
                                <span>🌙</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleAddNewModel}
                        className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                    >
                        <PlusCircle size={18} />
                        Ajouter un modèle
                    </button>
                </div>
            </Header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        name={stat.name}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        darkMode={darkMode}
                        textColor={stat.textColor}
                    />
                ))}
            </div>

            <div className={`mt-8 rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow'} transition-colors duration-300`}>
                <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    Modèles de correction par exercice
                </h2>
                
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <th className={`text-left p-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Exercice</th>
                                <th className={`text-left p-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Statut</th>
                                <th className={`text-left p-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Dernière mise à jour</th>
                                <th className={`text-right p-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {models.map((model) => (
                                <tr key={model.id} className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'} transition-colors duration-200`}>
                                    <td className={`p-3 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{model.exerciseTitle}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            model.status === "Actif" 
                                                ? darkMode ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-800"
                                                : darkMode ? "bg-yellow-500/20 text-yellow-400" : "bg-yellow-100 text-yellow-800"
                                        }`}>
                                            {model.status}
                                        </span>
                                    </td>
                                    <td className={`p-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{model.lastUpdate}</td>
                                    <td className="p-3 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleViewPdf(model)}
                                                className={`p-2 rounded-full hover:${darkMode ? 'bg-gray-700' : 'bg-gray-200'} text-blue-400 transition-colors`}
                                                title="Visualiser le modèle"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleEditModel(model)}
                                                className={`p-2 rounded-full hover:${darkMode ? 'bg-gray-700' : 'bg-gray-200'} text-yellow-500 transition-colors`}
                                                title="Modifier le modèle"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteModel(model.id)}
                                                className={`p-2 rounded-full hover:${darkMode ? 'bg-gray-700' : 'bg-gray-200'} text-red-500 transition-colors`}
                                                title="Supprimer le modèle"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {models.length === 0 && (
                                <tr>
                                    <td colSpan="4" className={`p-3 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Aucun modèle de correction n'est disponible
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-xl p-6 w-full max-w-3xl transition-colors duration-300`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {selectedExercise && selectedExercise.id
                                    ? `Modifier le modèle pour ${selectedExercise.title}`
                                    : "Ajouter un nouveau modèle de correction"}
                            </h2>
                            <button 
                                onClick={() => {
                                    setShowAddModal(false);
                                    setSelectedExercise(null);
                                }}
                                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'} transition-colors`}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <CorrectionModelForm
                            onClose={() => {
                                setShowAddModal(false);
                                setSelectedExercise(null);
                            }}
                            onSubmit={handleSubmitModel}
                            exerciseId={selectedExercise?.id}
                            initialData={selectedExercise && selectedExercise.id ? 
                                models.find(m => m.id === selectedExercise.id) : null}
                            darkMode={darkMode}
                        />
                    </div>
                </div>
            )}

            {showPdfViewer && selectedPdf && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} rounded-xl p-6 w-full max-w-5xl h-4/5 flex flex-col transition-colors duration-300`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                Modèle de correction pour {selectedPdf.exerciseTitle}
                            </h2>
                            <button 
                                onClick={() => {
                                    setShowPdfViewer(false);
                                    setSelectedPdf(null);
                                }}
                                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'} transition-colors`}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className={`flex-1 rounded-lg overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
                            <iframe 
                                src={selectedPdf.pdfUrl} 
                                className="w-full h-full"
                                title={`Modèle de correction - ${selectedPdf.exerciseTitle}`}
                            />
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default CorrectionModelsPage;