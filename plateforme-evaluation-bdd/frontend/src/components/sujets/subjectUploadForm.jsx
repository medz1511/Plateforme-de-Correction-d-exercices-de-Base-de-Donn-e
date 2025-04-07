import { useState } from "react";
import { useTheme } from "@/context/ThemeContext"; // ou '../context/ThemeContext'

const SubjectUploadForm = ({ onClose }) => {
    const { darkMode } = useTheme();
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            setErrorMessage("");
        } else {
            setErrorMessage("Veuillez sélectionner un fichier au format PDF.");
            setFile(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            setErrorMessage("Veuillez sélectionner un fichier PDF.");
            return;
        }

        console.log("Soumettre le fichier PDF:", file.name);
        setSuccessMessage("Votre devoir a été soumis avec succès !");
        setFile(null);
        setErrorMessage("");

        setTimeout(() => {
            onClose();
        }, 2000);
    };

    // Classes dynamiques
    const labelClasses = `block mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`;
    const inputClasses = `w-full p-2 rounded-lg border ${
        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
    }`;
    const cancelButtonClasses = `px-4 py-2 rounded-lg ${
        darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'
    } text-white transition-colors`;
    const submitButtonClasses = `px-4 py-2 rounded-lg ${
        darkMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-600'
    } text-white transition-colors`;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
                <label htmlFor="subjectFile" className={labelClasses}>
                    Choisir un fichier PDF
                </label>
                <input
                    id="subjectFile"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className={inputClasses}
                    required
                />
            </div>

            {/* Messages d'état */}
            {errorMessage && (
                <p className={`${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    {errorMessage}
                </p>
            )}
            {successMessage && (
                <p className={`${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {successMessage}
                </p>
            )}

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onClose}
                    className={cancelButtonClasses}
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className={submitButtonClasses}
                >
                    Soumettre
                </button>
            </div>
        </form>
    );
};

export default SubjectUploadForm;