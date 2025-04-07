import { useState, useEffect } from "react";
import { Edit, Trash2, Plus, Eye } from "lucide-react";

const CorrectionModelsTable = ({ onSelectExercise }) => {
    const [exercises, setExercises] = useState([]);
    const [expandedExercise, setExpandedExercise] = useState(null);
    
    // Données de test
    useEffect(() => {
        // Dans un cas réel, vous feriez un appel API ici
        setExercises([
            {
                id: 1,
                title: "Introduction SQL - Requêtes simples",
                subject: "Bases de données SQL",
                date: "12/03/2025",
                modelCount: 3,
                models: [
                    { id: 1, name: "Modèle standard", accuracy: "95%", lastUpdated: "10/03/2025" },
                    { id: 2, name: "Modèle alternatif", accuracy: "87%", lastUpdated: "08/03/2025" },
                    { id: 3, name: "Version simplifiée", accuracy: "82%", lastUpdated: "05/03/2025" }
                ]
            },
            {
                id: 2,
                title: "Jointures et sous-requêtes",
                subject: "Bases de données SQL",
                date: "15/03/2025",
                modelCount: 2,
                models: [
                    { id: 4, name: "Modèle détaillé", accuracy: "92%", lastUpdated: "14/03/2025" },
                    { id: 5, name: "Modèle concis", accuracy: "89%", lastUpdated: "12/03/2025" }
                ]
            },
            {
                id: 3,
                title: "Normalisation des bases de données",
                subject: "Conception BDD",
                date: "18/03/2025",
                modelCount: 2,
                models: [
                    { id: 6, name: "Modèle complet", accuracy: "94%", lastUpdated: "17/03/2025" },
                    { id: 7, name: "Modèle théorique", accuracy: "91%", lastUpdated: "15/03/2025" }
                ]
            }
        ]);
    }, []);

    const toggleExpand = (id) => {
        if (expandedExercise === id) {
            setExpandedExercise(null);
        } else {
            setExpandedExercise(id);
        }
    };

    const handleAddModel = (exercise) => {
        onSelectExercise(exercise);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-gray-200">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                    <tr>
                        <th className="px-4 py-3 rounded-tl-lg">Exercice</th>
                        <th className="px-4 py-3">Sujet</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Modèles</th>
                        <th className="px-4 py-3 rounded-tr-lg">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {exercises.map((exercise) => (
                        <>
                            <tr key={exercise.id} className="border-b border-gray-700 bg-gray-800 hover:bg-gray-700 cursor-pointer" onClick={() => toggleExpand(exercise.id)}>
                                <td className="px-4 py-3 font-medium">{exercise.title}</td>
                                <td className="px-4 py-3">{exercise.subject}</td>
                                <td className="px-4 py-3">{exercise.date}</td>
                                <td className="px-4 py-3">
                                    <span className="bg-blue-900 text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                        {exercise.modelCount}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddModel(exercise);
                                            }} 
                                            className="p-1.5 bg-blue-600 rounded-lg hover:bg-blue-700"
                                            title="Ajouter un modèle"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            {expandedExercise === exercise.id && (
                                <tr className="bg-gray-900">
                                    <td colSpan={5} className="px-4 py-3">
                                        <div className="p-4">
                                            <h3 className="text-sm font-medium text-gray-300 mb-3">Modèles de correction disponibles</h3>
                                            <div className="space-y-3">
                                                {exercise.models.map((model) => (
                                                    <div key={model.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                                                        <div>
                                                            <p className="font-medium">{model.name}</p>
                                                            <p className="text-xs text-gray-400">Dernière mise à jour: {model.lastUpdated}</p>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs bg-green-900 text-green-200 px-2 py-0.5 rounded-full">
                                                                Précision: {model.accuracy}
                                                            </span>
                                                            <div className="flex gap-2">
                                                                <button className="p-1.5 bg-gray-700 rounded-lg hover:bg-gray-600" title="Voir">
                                                                    <Eye size={16} />
                                                                </button>
                                                                <button className="p-1.5 bg-blue-600 rounded-lg hover:bg-blue-700" title="Modifier">
                                                                    <Edit size={16} />
                                                                </button>
                                                                <button className="p-1.5 bg-red-600 rounded-lg hover:bg-red-700" title="Supprimer">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CorrectionModelsTable;