import { useState, useEffect } from "react";
import { Upload, X, Save } from "lucide-react";

const CorrectionModelForm = ({ onClose, exerciseId = null }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        exerciseId: exerciseId || "",
        file: null,
        fileName: "",
        weight: 100, // Poids dans l'évaluation (en pourcentage)
        isDefault: false,
    });
    
    const [exercises, setExercises] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    
    // Charger les exercices disponibles
    useEffect(() => {
        // En production, ce serait un appel API
        setExercises([
            { id: 1, title: "Introduction SQL - Requêtes simples" },
            { id: 2, title: "Jointures et sous-requêtes" },
            { id: 3, title: "Normalisation des bases de données" },
            { id: 4, title: "Conception des schémas" },
            { id: 5, title: "Transactions et ACID" }
        ]);
        
        if (exerciseId) {
            setFormData(prev => ({
                ...prev,
                exerciseId: exerciseId
            }));
        }
    }, [exerciseId]);
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };
    
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setFormData(prev => ({
                ...prev,
                file: file,
                fileName: file.name
            }));
        }
    };
    
    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({
                ...prev,
                file: file,
                fileName: file.name
            }));
        }
    };
    
    const removeFile = () => {
        setFormData(prev => ({
            ...prev,
            file: null,
            fileName: ""
        }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // En production, vous feriez un appel API pour sauvegarder le modèle
        console.log("Submitting model:", formData);
        // Simulation d'un succès
        alert("Modèle de correction ajouté avec succès!");
        onClose();
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Nom du modèle
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Modèle standard SQL"
                        required
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Exercice associé
                    </label>
                    <select
                        name="exerciseId"
                        value={formData.exerciseId}
                        onChange={handleChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={exerciseId !== null}
                    >
                        <option value="">Sélectionner un exercice</option>
                        {exercises.map(exercise => (
                            <option key={exercise.id} value={exercise.id}>
                                {exercise.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Description du modèle de correction..."
                ></textarea>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fichier de correction (PDF)
                </label>
                <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center ${
                        dragActive ? "border-blue-500 bg-blue-900 bg-opacity-10" : "border-gray-600"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {!formData.file ? (
                        <>
                            <div className="flex flex-col items-center justify-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                <p className="mb-2 text-sm text-gray-400">
                                    <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                                </p>
                                <p className="text-xs text-gray-500">PDF (MAX. 10MB)</p>
                            </div>
                            <input
                                id="file-upload"
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                            <label
                                htmlFor="file-upload"
                                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
                            >
                                Parcourir les fichiers
                            </label>
                        </>
                    ) : (
                        <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                            <span className="text-gray-200">{formData.fileName}</span>
                            <button
                                type="button"
                                onClick={removeFile}
                                className="text-red-400 hover:text-red-500"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Poids dans l'évaluation (%)
                    </label>
                    <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        min="1"
                        max="100"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2.5 text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                
                <div className="flex items-center">
                    <input
                        id="default-model"
                        type="checkbox"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600"
                    />
                    <label
                        htmlFor="default-model"
                        className="ml-2 text-sm font-medium text-gray-300"
                    >
                        Définir comme modèle par défaut pour cet exercice
                    </label>
                </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                    <Save size={18} />
                    Enregistrer
                </button>
            </div>
        </form>
    );
};

export default CorrectionModelForm;