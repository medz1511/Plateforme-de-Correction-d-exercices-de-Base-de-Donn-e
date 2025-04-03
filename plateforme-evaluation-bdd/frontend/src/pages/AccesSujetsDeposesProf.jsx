import { motion } from "framer-motion";
import { FileText, CheckCircle, Upload, X, RefreshCw } from "lucide-react";
import { useState, useRef } from "react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SubjectsModelsTable from "../components/sujets/subjectsModelsTable";

const AccesSujetsDeposesEtudiant = () => {
    const subjectStats = {
        totalSubjects: 25,
        newSubjectsToday: 3,
        submittedSubjects: 20,
    };

    // Date de clôture des dépôts (format: YYYY-MM-DD)
    const deadlineDate = new Date("2025-05-01"); // Exemple : 1er mai 2025

    // Vérification si la date actuelle est après la date de clôture
    const isDeadlinePassed = new Date() > deadlineDate;

    const [subjects, setSubjects] = useState([
        { id: 1, title: "Sujet 1", subject: "Mathématiques", date: "2025-04-01", isSubmitted: false, fileName: "" },
        { id: 2, title: "Sujet 2", subject: "Physique", date: "2025-04-02", isSubmitted: false, fileName: "" },
        { id: 3, title: "Sujet 3", subject: "Informatique", date: "2025-04-03", isSubmitted: false, fileName: "" },
    ]);

    // Référence pour l'input file
    const fileInputRefs = useRef({});

    // État pour gérer l'affichage du modal de téléchargement
    const [uploadingSubjectId, setUploadingSubjectId] = useState(null);
    const [fileError, setFileError] = useState("");
    const [confirmWithdraw, setConfirmWithdraw] = useState(null);

    const openFileSelector = (subjectId) => {
        if (fileInputRefs.current[subjectId]) {
            fileInputRefs.current[subjectId].click();
        }
    };

    const handleFileChange = (subjectId, event) => {
        const file = event.target.files[0];
        
        if (file) {
            // Vérification que le fichier est bien un PDF
            if (file.type !== "application/pdf") {
                setFileError("Veuillez sélectionner un fichier PDF");
                return;
            }
            
            // Vérification de la taille du fichier (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setFileError("Le fichier ne doit pas dépasser 10MB");
                return;
            }
            
            setFileError("");
            
            // Simulation de téléchargement réussi
            // Dans une application réelle, vous enverriez le fichier au serveur ici
            setSubjects(subjects.map(subject => 
                subject.id === subjectId 
                    ? { ...subject, isSubmitted: true, fileName: file.name } 
                    : subject
            ));
            
            setUploadingSubjectId(null);
        }
    };

    const handleSubmit = (subjectId) => {
        setUploadingSubjectId(subjectId);
    };

    const handleWithdraw = (subjectId) => {
        setConfirmWithdraw(subjectId);
    };

    const confirmWithdrawSubmission = (subjectId) => {
        // Dans une application réelle, vous enverriez une requête au serveur pour supprimer le fichier
        setSubjects(subjects.map(subject => 
            subject.id === subjectId 
                ? { ...subject, isSubmitted: false, fileName: "" } 
                : subject
        ));
        setConfirmWithdraw(null);
    };

    return (
        <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
            <Header title="Accès aux Sujets Déposés" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                {/* Animation pour les statistiques */}
                <motion.div
                    className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <StatCard
                        name="Total Sujets"
                        icon={FileText}
                        value={subjectStats.totalSubjects}
                        color="#6366F1"
                    />
                    <StatCard
                        name="Nouveaux Sujets Aujourd'hui"
                        icon={CheckCircle}
                        value={subjectStats.newSubjectsToday}
                        color="#10B981"
                    />
                    <StatCard
                        name="Sujets Soumis"
                        icon={CheckCircle}
                        value={subjectStats.submittedSubjects}
                        color="#F59E0B"
                    />
                </motion.div>

                {/* Tableau des sujets déposés */}
                <motion.div className="overflow-x-auto">
                    <table className="min-w-full text-gray-200">
                        <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                            <tr>
                                <th className="px-6 py-3 text-left">Sujet</th>
                                <th className="px-6 py-3 text-center">Date</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject) => (
                                <tr key={subject.id} className="border-b border-gray-700 hover:bg-gray-700">
                                    <td className="px-6 py-3">{subject.title}</td>
                                    <td className="px-6 py-3 text-center">{subject.date}</td>
                                    <td className="px-6 py-3 flex justify-center">
                                        {/* Centrage des boutons et messages */}
                                        <div className="flex justify-center items-center w-full">
                                            {/* Input de fichier caché */}
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                ref={el => fileInputRefs.current[subject.id] = el}
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleFileChange(subject.id, e)}
                                            />
                                        
                                            {!subject.isSubmitted && !isDeadlinePassed && (
                                                <button
                                                    className="flex justify-center items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                    onClick={() => handleSubmit(subject.id)}
                                                >
                                                    <Upload className="mr-2" />
                                                    Rendre le devoir
                                                </button>
                                            )}
                                            {subject.isSubmitted && !isDeadlinePassed && (
                                                <div className="flex flex-col items-center space-y-2">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-green-400 mb-1">Devoir rendu</span>
                                                        <span className="text-gray-400 text-sm">{subject.fileName}</span>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            className="flex justify-center items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                                            onClick={() => handleWithdraw(subject.id)}
                                                        >
                                                            <X className="mr-1 h-4 w-4" />
                                                            Retirer
                                                        </button>
                                                        <button
                                                            className="flex justify-center items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                                            onClick={() => handleSubmit(subject.id)}
                                                        >
                                                            <RefreshCw className="mr-1 h-4 w-4" />
                                                            Remplacer
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {subject.isSubmitted && isDeadlinePassed && (
                                                <div className="flex flex-col items-center">
                                                    <span className="text-green-400 mb-1">Devoir rendu</span>
                                                    <span className="text-gray-400 text-sm">{subject.fileName}</span>
                                                </div>
                                            )}
                                            {isDeadlinePassed && !subject.isSubmitted && (
                                                <span className="text-red-500">Date limite dépassée</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>

                {/* Afficher un message si la date de clôture est atteinte */}
                {isDeadlinePassed && (
                    <div className="mt-4 text-red-500">
                        La date de clôture des dépôts est passée. Vous ne pouvez plus soumettre de nouveaux devoirs.
                    </div>
                )}

                {/* Modal de téléchargement de fichier */}
                {uploadingSubjectId && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                            <h3 className="text-xl font-semibold mb-4 text-white">
                                {subjects.find(s => s.id === uploadingSubjectId)?.isSubmitted 
                                    ? "Remplacer votre devoir" 
                                    : "Télécharger votre devoir"}
                            </h3>
                            
                            {fileError && (
                                <div className="mb-4 p-3 bg-red-900 text-white rounded">
                                    {fileError}
                                </div>
                            )}
                            
                            <p className="mb-4 text-gray-300">
                                Veuillez sélectionner un fichier PDF de votre devoir pour le sujet : 
                                <span className="font-bold"> {subjects.find(s => s.id === uploadingSubjectId)?.title}</span>
                            </p>
                            
                            {subjects.find(s => s.id === uploadingSubjectId)?.isSubmitted && (
                                <p className="mb-4 text-yellow-400">
                                    Attention : cette action remplacera votre fichier existant ({subjects.find(s => s.id === uploadingSubjectId)?.fileName}).
                                </p>
                            )}
                            
                            <div className="flex justify-center mb-4">
                                <button 
                                    onClick={() => openFileSelector(uploadingSubjectId)}
                                    className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    <FileText className="mr-2" />
                                    Sélectionner un fichier PDF
                                </button>
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-6">
                                <button 
                                    onClick={() => setUploadingSubjectId(null)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de confirmation pour retirer un devoir */}
                {confirmWithdraw && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
                            <h3 className="text-xl font-semibold mb-4 text-white">Confirmer le retrait</h3>
                            
                            <p className="mb-4 text-gray-300">
                                Êtes-vous sûr de vouloir retirer votre devoir pour le sujet : 
                                <span className="font-bold"> {subjects.find(s => s.id === confirmWithdraw)?.title}</span> ?
                            </p>
                            
                            <p className="mb-6 text-yellow-400">
                                Cette action supprimera votre fichier actuel ({subjects.find(s => s.id === confirmWithdraw)?.fileName}).
                                Vous pourrez soumettre un nouveau fichier ultérieurement.
                            </p>
                            
                            <div className="flex justify-end gap-2 mt-6">
                                <button 
                                    onClick={() => setConfirmWithdraw(null)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    Annuler
                                </button>
                                <button 
                                    onClick={() => confirmWithdrawSubmission(confirmWithdraw)}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Confirmer le retrait
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AccesSujetsDeposesEtudiant;