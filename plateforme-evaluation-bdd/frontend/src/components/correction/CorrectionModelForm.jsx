import { useState, useEffect } from "react";
import { Upload, X, Save } from "lucide-react";
import { useTheme } from '@/context/ThemeContext';

const CorrectionModelForm = ({ onClose, onSubmit, exerciseId = null, initialData = null, darkMode }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        description: initialData?.description || "",
        exerciseId: exerciseId || initialData?.exerciseId || "",
        file: null,
        fileName: initialData?.fileName || "",
        weight: initialData?.weight || 100,
        isDefault: initialData?.isDefault || false,
    });
    
    const [exercises, setExercises] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    
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
        onSubmit(formData);
    };
    
    // Classes CSS dynamiques
    const inputClasses = `w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} border rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500`;
    const labelClasses = `block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`;
    const dropzoneClasses = `border-2 border-dashed rounded-lg p-8 text-center ${
        dragActive 
            ? `${darkMode ? 'border-blue-500 bg-blue-900 bg-opacity-10' : 'border-blue-400 bg-blue-50'}` 
            : `${darkMode ? 'border-gray-600' : 'border-gray-300'}`
    }`;
    const filePreviewClasses = `flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`;
    
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>
                        Nom du modèle
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClasses}
                        placeholder="Ex: Modèle standard SQL"
                        required
                    />
                </div>
                
                <div>
                    <label className={labelClasses}>
                        Exercice associé
                    </label>
                    <select
                        name="exerciseId"
                        value={formData.exerciseId}
                        onChange={handleChange}
                        className={inputClasses}
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
                <label className={labelClasses}>
                    Description
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className={inputClasses}
                    placeholder="Description du modèle de correction..."
                ></textarea>
            </div>
            
            <div>
                <label className={labelClasses}>
                    Fichier de correction (PDF)
                </label>
                <div 
                    className={dropzoneClasses}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {!formData.file ? (
                        <>
                            <div className="flex flex-col items-center justify-center">
                                <Upload className={`mx-auto h-12 w-12 mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <p className={`mb-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                                </p>
                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>PDF (MAX. 10MB)</p>
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
                                className={`mt-4 inline-flex items-center px-4 py-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg cursor-pointer transition-colors`}
                            >
                                Parcourir les fichiers
                            </label>
                        </>
                    ) : (
                        <div className={filePreviewClasses}>
                            <span>{formData.fileName}</span>
                            <button
                                type="button"
                                onClick={removeFile}
                                className={`${darkMode ? 'text-red-400 hover:text-red-500' : 'text-red-500 hover:text-red-600'} transition-colors`}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClasses}>
                        Poids dans l'évaluation (%)
                    </label>
                    <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        min="1"
                        max="100"
                        className={inputClasses}
                    />
                </div>
                
                <div className="flex items-center">
                    <input
                        id="default-model"
                        type="checkbox"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        className={`w-4 h-4 ${darkMode ? 'text-blue-500 bg-gray-700 border-gray-600' : 'text-blue-600 bg-white border-gray-300'} rounded focus:ring-blue-500`}
                    />
                    <label
                        htmlFor="default-model"
                        className={`ml-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                        Définir comme modèle par défaut pour cet exercice
                    </label>
                </div>
            </div>
            
            <div className={`flex justify-end space-x-3 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                    type="button"
                    onClick={onClose}
                    className={`px-4 py-2 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} text-gray-900 rounded-lg transition-colors`}
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className={`flex items-center gap-2 px-4 py-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-lg transition-colors`}
                >
                    <Save size={18} />
                    Enregistrer
                </button>
            </div>
        </form>
    );
};

export default CorrectionModelForm;