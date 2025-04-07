import { useState } from "react";

const SubjectUploadForm = ({ onClose }) => {
    const [file, setFile] = useState(null); // Gérer le fichier sélectionné
    const [errorMessage, setErrorMessage] = useState(""); // Gérer les messages d'erreur
    const [successMessage, setSuccessMessage] = useState(""); // Gérer le message de succès

    // Gérer le changement de fichier
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            setErrorMessage(""); // Réinitialiser les messages d'erreur si le fichier est valide
        } else {
            setErrorMessage("Veuillez sélectionner un fichier au format PDF.");
            setFile(null); // Réinitialiser le fichier si le format est incorrect
        }
    };

    // Soumettre le fichier
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) {
            setErrorMessage("Veuillez sélectionner un fichier PDF.");
            return;
        }

        // Logique pour soumettre le fichier (par exemple, envoi au backend)
        console.log("Soumettre le fichier PDF:", file.name);
        
        // Simulation de soumission réussie
        setSuccessMessage("Votre devoir a été soumis avec succès !");
        setFile(null); // Réinitialiser le fichier après soumission
        setErrorMessage(""); // Réinitialiser les messages d'erreur

        // Fermer la modal après soumission
        setTimeout(() => {
            onClose();
        }, 2000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
                <label htmlFor="subjectFile" className="block text-white">Choisir un fichier PDF</label>
                <input
                    id="subjectFile"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="w-full p-2 rounded-lg border border-gray-300"
                    required
                />
            </div>

            {/* Affichage des messages d'erreur ou de succès */}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}

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

export default SubjectUploadForm;
