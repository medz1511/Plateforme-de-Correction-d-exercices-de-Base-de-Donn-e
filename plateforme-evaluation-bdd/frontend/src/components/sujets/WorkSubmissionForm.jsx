import { useState } from "react";

const WorkSubmissionForm = ({ onClose, subjectId }) => {
    const [workFile, setWorkFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setWorkFile(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!workFile) {
            setErrorMessage("Veuillez sélectionner un fichier à soumettre.");
            return;
        }

        // Ajouter la logique pour envoyer le fichier au backend pour la soumission
        console.log("Soumettre le fichier pour le sujet:", subjectId);
        console.log("Fichier soumis:", workFile.name);
        
        // Appel de fonction pour fermer le modal après soumission
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
                <label htmlFor="workFile" className="block text-white">Choisir le fichier à soumettre</label>
                <input
                    id="workFile"
                    type="file"
                    onChange={handleFileChange}
                    className="w-full p-2 rounded-lg border border-gray-300"
                    required
                />
            </div>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Soumettre
                </button>
            </div>
        </form>
    );
};

export default WorkSubmissionForm;
