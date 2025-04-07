import { useState } from "react";
import { useTheme } from "@/context/ThemeContext"; // ou '../context/ThemeContext'

const WorkSubmissionForm = ({ onClose, subjectId }) => {
    const { darkMode } = useTheme();
    const [workFile, setWorkFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setWorkFile(file);
            setErrorMessage(""); // Reset error when new file is selected
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!workFile) {
            setErrorMessage("Veuillez sélectionner un fichier à soumettre.");
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Simulation d'envoi au backend
            console.log("Soumettre le fichier pour le sujet:", subjectId);
            console.log("Fichier soumis:", workFile.name);
            
            // Attendre 1s pour simuler l'envoi
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            onClose();
        } catch (error) {
            setErrorMessage("Erreur lors de la soumission du fichier.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Classes dynamiques
    const labelClasses = `block mb-2 text-sm font-medium ${
        darkMode ? 'text-gray-300' : 'text-gray-700'
    }`;
    
    const inputClasses = `w-full text-sm rounded-lg border ${
        darkMode 
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' 
            : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
    } p-2.5`;

    const cancelButtonClasses = `px-4 py-2 rounded-lg text-white transition-colors ${
        darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-500 hover:bg-gray-600'
    }`;

    const submitButtonClasses = `px-4 py-2 rounded-lg text-white transition-colors ${
        darkMode 
            ? 'bg-blue-600 hover:bg-blue-500' 
            : 'bg-blue-500 hover:bg-blue-600'
    } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="workFile" className={labelClasses}>
                    Choisir le fichier à soumettre
                </label>
                <input
                    id="workFile"
                    type="file"
                    onChange={handleFileChange}
                    className={inputClasses}
                    required
                />
            </div>

            {errorMessage && (
                <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    {errorMessage}
                </p>
            )}

            {workFile && (
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Fichier sélectionné: <span className="font-medium">{workFile.name}</span>
                </p>
            )}

            <div className="flex justify-end gap-2 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className={cancelButtonClasses}
                    disabled={isSubmitting}
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className={submitButtonClasses}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
                </button>
            </div>
        </form>
    );
};

export default WorkSubmissionForm;