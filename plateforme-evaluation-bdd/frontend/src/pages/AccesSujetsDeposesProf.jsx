import { motion } from "framer-motion";
import { FileText, CheckCircle, Upload, X, RefreshCw, Eye, Download, Calendar, AlertCircle, CheckSquare } from "lucide-react";
import { useState, useRef } from "react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SubjectsModelsTable from "../components/sujets/subjectsModelsTable";
//affinement
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

    // URL de base pour les sujets (à adapter selon votre architecture)
    const baseSubjectUrl = "/api/subjects";

    const [subjects, setSubjects] = useState([
        { 
            id: 1, 
            title: "Sujet 1", 
            subject: "Mathématiques", 
            date: "2025-04-01", 
            description: "Ce sujet porte sur les équations différentielles et les applications en physique. Vous devrez résoudre un ensemble de problèmes et expliquer votre démarche.", 
            deadline: "2025-04-20",
            isSubmitted: false, 
            fileName: "", 
            pdfUrl: "/path/to/subject1.pdf" 
        },
        { 
            id: 2, 
            title: "Sujet 2", 
            subject: "Physique", 
            date: "2025-04-02", 
            description: "Analyse des circuits électriques et lois de Kirchhoff. Ce devoir comprend une partie théorique et des exercices pratiques.", 
            deadline: "2025-04-22",
            isSubmitted: false, 
            fileName: "", 
            pdfUrl: "/path/to/subject2.pdf" 
        },
        { 
            id: 3, 
            title: "Sujet 3", 
            subject: "Informatique", 
            date: "2025-04-03", 
            description: "Programmation orientée objet et conception d'algorithmes. Vous devrez implémenter une solution et analyser sa complexité.", 
            deadline: "2025-04-25",
            isSubmitted: false, 
            fileName: "", 
            pdfUrl: "/path/to/subject3.pdf" 
        },
    ]);

    // Référence pour l'input file
    const fileInputRefs = useRef({});

    // État pour gérer l'affichage du modal de téléchargement
    const [uploadingSubjectId, setUploadingSubjectId] = useState(null);
    const [fileError, setFileError] = useState("");
    const [confirmWithdraw, setConfirmWithdraw] = useState(null);
    
    // État pour le modal d'affichage du PDF
    const [viewingPdf, setViewingPdf] = useState(null);
    // Nouvel état pour le modal d'affichage des détails du sujet
    const [viewingSubjectDetails, setViewingSubjectDetails] = useState(null);

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

    // Fonctions pour gérer les actions d'affichage et de téléchargement
    const viewSubject = (subjectId) => {
        const subject = subjects.find(s => s.id === subjectId);
        if (subject) {
            // Ouvrir le modal de détails du sujet au lieu du PDF directement
            setViewingSubjectDetails(subject);
        }
    };

    // Nouvelle fonction pour ouvrir le PDF après avoir vu les détails
    const openPdfViewer = (subject) => {
        setViewingSubjectDetails(null);
        setViewingPdf(subject);
    };

    const downloadSubject = (subjectId) => {
        const subject = subjects.find(s => s.id === subjectId);
        if (subject) {
            // Créer un lien temporaire pour déclencher le téléchargement
            const link = document.createElement('a');
            link.href = subject.pdfUrl;
            link.download = `${subject.title}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // Fermer les modals
    const closeViewingPdf = () => {
        setViewingPdf(null);
    };

    const closeViewingDetails = () => {
        setViewingSubjectDetails(null);
    };

    // Formater la date pour l'affichage
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    // Vérifier si la date limite est proche (moins de 3 jours)
    const isDeadlineClose = (deadlineString) => {
        const today = new Date();
        const deadline = new Date(deadlineString);
        const diffTime = deadline - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 && diffDays <= 3;
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
                                                <div className="flex space-x-2">
                                                    {/* Bouton œil pour visualiser */}
                                                    <button
                                                        className="flex justify-center items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                        onClick={() => viewSubject(subject.id)}
                                                        title="Visualiser le sujet"
                                                    >
                                                        <Eye className="h-5 w-5" />
                                                    </button>
                                                    
                                                    {/* Bouton télécharger */}
                                                    <button
                                                        className="flex justify-center items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                                        onClick={() => downloadSubject(subject.id)}
                                                        title="Télécharger le sujet"
                                                    >
                                                        <Download className="h-5 w-5" />
                                                    </button>
                                                    
                                                    {/* Bouton rendre le devoir */}
                                                    <button
                                                        className="flex justify-center items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                        onClick={() => handleSubmit(subject.id)}
                                                    >
                                                        <Upload className="mr-2" />
                                                        Rendre le devoir
                                                    </button>
                                                </div>
                                            )}
                                            {subject.isSubmitted && !isDeadlinePassed && (
                                                <div className="flex flex-col items-center space-y-2">
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-green-400 mb-1">Devoir rendu</span>
                                                        <span className="text-gray-400 text-sm">{subject.fileName}</span>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        {/* Ajout des boutons œil et télécharger */}
                                                        <button
                                                            className="flex justify-center items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                                            onClick={() => viewSubject(subject.id)}
                                                            title="Visualiser le sujet"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            className="flex justify-center items-center px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                                                            onClick={() => downloadSubject(subject.id)}
                                                            title="Télécharger le sujet"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </button>
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
                                                    <div className="flex space-x-2 mt-2">
                                                        <button
                                                            className="flex justify-center items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                                            onClick={() => viewSubject(subject.id)}
                                                            title="Visualiser le sujet"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            className="flex justify-center items-center px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                                                            onClick={() => downloadSubject(subject.id)}
                                                            title="Télécharger le sujet"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {isDeadlinePassed && !subject.isSubmitted && (
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        className="flex justify-center items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                                        onClick={() => viewSubject(subject.id)}
                                                        title="Visualiser le sujet"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        className="flex justify-center items-center px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                                                        onClick={() => downloadSubject(subject.id)}
                                                        title="Télécharger le sujet"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </button>
                                                    <span className="text-red-500">Date limite dépassée</span>
                                                </div>
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

                {/* NOUVEAU: Modal pour afficher les détails du sujet */}
                {viewingSubjectDetails && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-semibold text-white">
                                    {viewingSubjectDetails.title}
                                </h3>
                                <button 
                                    onClick={closeViewingDetails}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <div className="bg-gray-700 p-6 rounded-lg mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center">
                                        <FileText className="text-blue-400 mr-2" size={20} />
                                        <span className="text-gray-300">Matière: </span>
                                        <span className="ml-2 text-white font-medium">{viewingSubjectDetails.subject}</span>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <Calendar className="text-blue-400 mr-2" size={20} />
                                        <span className="text-gray-300">Date de publication: </span>
                                        <span className="ml-2 text-white font-medium">{formatDate(viewingSubjectDetails.date)}</span>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <AlertCircle className="text-red-400 mr-2" size={20} />
                                        <span className="text-gray-300">Date limite: </span>
                                        <span className={`ml-2 font-medium ${
                                            isDeadlinePassed ? 'text-red-500' : 
                                            isDeadlineClose(viewingSubjectDetails.deadline) ? 'text-yellow-400' : 'text-green-400'
                                        }`}>
                                            {formatDate(viewingSubjectDetails.deadline)}
                                            {isDeadlinePassed ? ' (Dépassée)' : 
                                             isDeadlineClose(viewingSubjectDetails.deadline) ? ' (Proche)' : ''}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <CheckSquare className={`mr-2 ${viewingSubjectDetails.isSubmitted ? 'text-green-400' : 'text-gray-400'}`} size={20} />
                                        <span className="text-gray-300">Statut: </span>
                                        <span className={`ml-2 font-medium ${viewingSubjectDetails.isSubmitted ? 'text-green-400' : 'text-yellow-400'}`}>
                                            {viewingSubjectDetails.isSubmitted ? 'Devoir rendu' : 'À rendre'}
                                            {viewingSubjectDetails.isSubmitted && 
                                                <span className="text-sm text-gray-400 ml-2">({viewingSubjectDetails.fileName})</span>
                                            }
                                        </span>
                                    </div>
                                </div>
                                
                                <h4 className="text-lg text-white font-medium mb-2">Description du sujet</h4>
                                <p className="text-gray-200 mb-4">{viewingSubjectDetails.description}</p>
                                
                                {!viewingSubjectDetails.isSubmitted && !isDeadlinePassed ? (
                                    <div className="p-3 bg-gray-600 rounded text-yellow-300 flex items-center">
                                        <AlertCircle className="mr-2" size={18} />
                                        N'oubliez pas de rendre votre devoir avant la date limite.
                                    </div>
                                ) : viewingSubjectDetails.isSubmitted ? (
                                    <div className="p-3 bg-green-900 rounded text-green-300 flex items-center">
                                        <CheckCircle className="mr-2" size={18} />
                                        Votre devoir a bien été rendu.
                                    </div>
                                ) : (
                                    <div className="p-3 bg-red-900 rounded text-red-300 flex items-center">
                                        <X className="mr-2" size={18} />
                                        La date limite est dépassée. Vous ne pouvez plus rendre votre devoir.
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex justify-between">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => openPdfViewer(viewingSubjectDetails)}
                                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        <Eye className="mr-2" />
                                        Voir le PDF
                                    </button>
                                    
                                    <button
                                        onClick={() => downloadSubject(viewingSubjectDetails.id)}
                                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                    >
                                        <Download className="mr-2" />
                                        Télécharger
                                    </button>
                                </div>
                                
                                {!viewingSubjectDetails.isSubmitted && !isDeadlinePassed && (
                                    <button 
                                        onClick={() => {
                                            closeViewingDetails();
                                            handleSubmit(viewingSubjectDetails.id);
                                        }}
                                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        <Upload className="mr-2" />
                                        Rendre le devoir
                                    </button>
                                )}
                                
                                <button 
                                    onClick={closeViewingDetails}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal pour afficher le PDF */}
                {viewingPdf && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
                        <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-5xl h-5/6 flex flex-col">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-white">
                                    {viewingPdf.title}
                                </h3>
                                <button 
                                    onClick={closeViewingPdf}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <div className="flex-1 bg-white rounded overflow-hidden">
                                <iframe 
                                    src={`${viewingPdf.pdfUrl}#toolbar=0`} 
                                    className="w-full h-full" 
                                    title={`PDF pour ${viewingPdf.title}`}
                                />
                            </div>
                            
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={() => downloadSubject(viewingPdf.id)}
                                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                                >
                                    <Download className="mr-2 h-5 w-5" />
                                    Télécharger ce fichier
                                </button>
                                <button 
                                    onClick={closeViewingPdf}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                >
                                    Fermer
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