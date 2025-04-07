import { motion } from "framer-motion";
import { FileText, CheckCircle, Upload, X, RefreshCw, Eye, Download, Calendar, AlertCircle, CheckSquare } from "lucide-react";
import { useState, useRef } from "react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { useTheme } from "../context/ThemeContext";

const AccesSujetsDeposesEtudiant = () => {
    const { darkMode } = useTheme();
    const subjectStats = {
        totalSubjects: 25,
        newSubjectsToday: 3,
        submittedSubjects: 20,
    };

    const deadlineDate = new Date("2025-05-01");
    const isDeadlinePassed = new Date() > deadlineDate;
    const baseSubjectUrl = "/api/subjects";

    const [subjects, setSubjects] = useState([
        { 
            id: 1, 
            title: "Sujet 1", 
            subject: "Mathématiques", 
            date: "2025-04-01", 
            description: "Ce sujet porte sur les équations différentielles et les applications en physique.", 
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
            description: "Analyse des circuits électriques et lois de Kirchhoff.", 
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
            description: "Programmation orientée objet et conception d'algorithmes.", 
            deadline: "2025-04-25",
            isSubmitted: false, 
            fileName: "", 
            pdfUrl: "/path/to/subject3.pdf" 
        },
    ]);

    const fileInputRefs = useRef({});
    const [uploadingSubjectId, setUploadingSubjectId] = useState(null);
    const [fileError, setFileError] = useState("");
    const [confirmWithdraw, setConfirmWithdraw] = useState(null);
    const [viewingPdf, setViewingPdf] = useState(null);
    const [viewingSubjectDetails, setViewingSubjectDetails] = useState(null);

    const openFileSelector = (subjectId) => {
        if (fileInputRefs.current[subjectId]) {
            fileInputRefs.current[subjectId].click();
        }
    };

    const handleFileChange = (subjectId, event) => {
        const file = event.target.files[0];
        
        if (file) {
            if (file.type !== "application/pdf") {
                setFileError("Veuillez sélectionner un fichier PDF");
                return;
            }
            
            if (file.size > 10 * 1024 * 1024) {
                setFileError("Le fichier ne doit pas dépasser 10MB");
                return;
            }
            
            setFileError("");
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
        setSubjects(subjects.map(subject => 
            subject.id === subjectId 
                ? { ...subject, isSubmitted: false, fileName: "" } 
                : subject
        ));
        setConfirmWithdraw(null);
    };

    const viewSubject = (subjectId) => {
        const subject = subjects.find(s => s.id === subjectId);
        if (subject) {
            setViewingSubjectDetails(subject);
        }
    };

    const openPdfViewer = (subject) => {
        setViewingSubjectDetails(null);
        setViewingPdf(subject);
    };

    const downloadSubject = (subjectId) => {
        const subject = subjects.find(s => s.id === subjectId);
        if (subject) {
            const link = document.createElement('a');
            link.href = subject.pdfUrl;
            link.download = `${subject.title}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const closeViewingPdf = () => {
        setViewingPdf(null);
    };

    const closeViewingDetails = () => {
        setViewingSubjectDetails(null);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    const isDeadlineClose = (deadlineString) => {
        const today = new Date();
        const deadline = new Date(deadlineString);
        const diffTime = deadline - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 && diffDays <= 3;
    };

    return (
        <div className={`flex-1 overflow-auto relative z-10 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
            <Header title="Accès aux Sujets Déposés" />

            <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
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
                        color={darkMode ? "#8183f4" : "#6366F1"}
                        darkMode={darkMode}
                    />
                    <StatCard
                        name="Nouveaux Sujets Aujourd'hui"
                        icon={CheckCircle}
                        value={subjectStats.newSubjectsToday}
                        color={darkMode ? "#34D399" : "#10B981"}
                        darkMode={darkMode}
                    />
                    <StatCard
                        name="Sujets Soumis"
                        icon={CheckCircle}
                        value={subjectStats.submittedSubjects}
                        color={darkMode ? "#F59E0B" : "#F59E0B"}
                        darkMode={darkMode}
                    />
                </motion.div>

                <motion.div className="overflow-x-auto">
                    <table className={`min-w-full ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        <thead className={`text-xs uppercase ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                            <tr>
                                <th className="px-6 py-3 text-left">Sujet</th>
                                <th className="px-6 py-3 text-center">Date</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject) => (
                                <tr key={subject.id} className={`border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-100'}`}>
                                    <td className="px-6 py-3">{subject.title}</td>
                                    <td className="px-6 py-3 text-center">{subject.date}</td>
                                    <td className="px-6 py-3 flex justify-center">
                                        <div className="flex justify-center items-center w-full">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                ref={el => fileInputRefs.current[subject.id] = el}
                                                style={{ display: 'none' }}
                                                onChange={(e) => handleFileChange(subject.id, e)}
                                            />
                                            
                                            {/* Cas 1: Sujet non soumis et date limite non dépassée */}
                                            {!subject.isSubmitted && !isDeadlinePassed && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        className={`flex justify-center items-center px-3 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                                                        onClick={() => viewSubject(subject.id)}
                                                        title="Visualiser le sujet"
                                                    >
                                                        <Eye className="h-5 w-5" />
                                                    </button>
                                                    
                                                    <button
                                                        className={`flex justify-center items-center px-3 py-2 rounded-lg ${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white`}
                                                        onClick={() => downloadSubject(subject.id)}
                                                        title="Télécharger le sujet"
                                                    >
                                                        <Download className="h-5 w-5" />
                                                    </button>
                                                    
                                                    <button
                                                        className={`flex justify-center items-center px-4 py-2 rounded-lg ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
                                                        onClick={() => handleSubmit(subject.id)}
                                                    >
                                                        <Upload className="mr-2" />
                                                        Rendre le devoir
                                                    </button>
                                                </div>
                                            )}
                                            
                                            {/* Cas 2: Sujet soumis mais date limite non dépassée (avec possibilité de remplacer) */}
                                            {subject.isSubmitted && !isDeadlinePassed && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        className={`flex justify-center items-center px-3 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                                                        onClick={() => viewSubject(subject.id)}
                                                        title="Visualiser le sujet"
                                                    >
                                                        <Eye className="h-5 w-5" />
                                                    </button>
                                                    
                                                    <button
                                                        className={`flex justify-center items-center px-3 py-2 rounded-lg ${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white`}
                                                        onClick={() => downloadSubject(subject.id)}
                                                        title="Télécharger le sujet"
                                                    >
                                                        <Download className="h-5 w-5" />
                                                    </button>
                                                    
                                                    <div className={`flex items-center px-3 py-2 rounded-lg ${darkMode ? 'bg-green-800' : 'bg-green-100'} ${darkMode ? 'text-green-200' : 'text-green-800'}`}>
                                                        <CheckCircle className="h-5 w-5 mr-2" />
                                                        <span className="mr-2">Devoir rendu: {subject.fileName}</span>
                                                    </div>
                                                    
                                                    <button
                                                        className={`flex justify-center items-center px-3 py-2 rounded-lg ${darkMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-500 hover:bg-amber-600'} text-white`}
                                                        onClick={() => handleSubmit(subject.id)}
                                                        title="Remplacer votre devoir"
                                                    >
                                                        <RefreshCw className="h-5 w-5" />
                                                    </button>
                                                    
                                                    <button
                                                        className={`flex justify-center items-center px-3 py-2 rounded-lg ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}
                                                        onClick={() => handleWithdraw(subject.id)}
                                                        title="Retirer votre devoir"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            )}
                                            
                                            {/* Cas 3: Sujet non soumis et date limite dépassée */}
                                            {!subject.isSubmitted && isDeadlinePassed && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        className={`flex justify-center items-center px-3 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                                                        onClick={() => viewSubject(subject.id)}
                                                        title="Visualiser le sujet"
                                                    >
                                                        <Eye className="h-5 w-5" />
                                                    </button>
                                                    
                                                    <button
                                                        className={`flex justify-center items-center px-3 py-2 rounded-lg ${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white`}
                                                        onClick={() => downloadSubject(subject.id)}
                                                        title="Télécharger le sujet"
                                                    >
                                                        <Download className="h-5 w-5" />
                                                    </button>
                                                    
                                                    <div className={`flex items-center px-3 py-2 rounded-lg ${darkMode ? 'bg-red-800' : 'bg-red-100'} ${darkMode ? 'text-red-200' : 'text-red-800'}`}>
                                                        <AlertCircle className="h-5 w-5 mr-2" />
                                                        Date limite dépassée
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Cas 4: Sujet soumis et date limite dépassée */}
                                            {subject.isSubmitted && isDeadlinePassed && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        className={`flex justify-center items-center px-3 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                                                        onClick={() => viewSubject(subject.id)}
                                                        title="Visualiser le sujet"
                                                    >
                                                        <Eye className="h-5 w-5" />
                                                    </button>
                                                    
                                                    <button
                                                        className={`flex justify-center items-center px-3 py-2 rounded-lg ${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white`}
                                                        onClick={() => downloadSubject(subject.id)}
                                                        title="Télécharger le sujet"
                                                    >
                                                        <Download className="h-5 w-5" />
                                                    </button>
                                                    
                                                    <div className={`flex items-center px-3 py-2 rounded-lg ${darkMode ? 'bg-green-800' : 'bg-green-100'} ${darkMode ? 'text-green-200' : 'text-green-800'}`}>
                                                        <CheckCircle className="h-5 w-5 mr-2" />
                                                        Devoir rendu: {subject.fileName}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>

                {isDeadlinePassed && (
                    <div className={`mt-4 p-3 rounded ${darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800'}`}>
                        La date de clôture des dépôts est passée. Vous ne pouvez plus soumettre de nouveaux devoirs.
                    </div>
                )}

                {/* Modal pour télécharger un devoir */}
                {uploadingSubjectId && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg max-w-md w-full`}>
                            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                {subjects.find(s => s.id === uploadingSubjectId)?.isSubmitted 
                                    ? "Remplacer votre devoir" 
                                    : "Télécharger votre devoir"}
                            </h3>
                            
                            {fileError && (
                                <div className={`mb-4 p-3 rounded ${darkMode ? 'bg-red-900 text-white' : 'bg-red-100 text-red-800'}`}>
                                    {fileError}
                                </div>
                            )}
                            
                            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Veuillez sélectionner un fichier PDF pour le sujet : 
                                <span className="font-bold"> {subjects.find(s => s.id === uploadingSubjectId)?.title}</span>
                            </p>
                            
                            <div className="flex justify-center mb-4">
                                <button 
                                    onClick={() => openFileSelector(uploadingSubjectId)}
                                    className={`flex items-center justify-center px-4 py-2 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                                >
                                    <FileText className="mr-2" />
                                    Sélectionner un fichier PDF
                                </button>
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-6">
                                <button 
                                    onClick={() => setUploadingSubjectId(null)}
                                    className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} ${darkMode ? 'text-white' : 'text-gray-800'}`}
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal pour confirmer le retrait d'un devoir */}
                {confirmWithdraw && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg max-w-md w-full`}>
                            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                Confirmer le retrait
                            </h3>
                            
                            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                Êtes-vous sûr de vouloir retirer votre devoir pour le sujet : 
                                <span className="font-bold"> {subjects.find(s => s.id === confirmWithdraw)?.title}</span> ?
                            </p>
                            
                            <div className="flex justify-end gap-2 mt-6">
                                <button 
                                    onClick={() => setConfirmWithdraw(null)}
                                    className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} ${darkMode ? 'text-white' : 'text-gray-800'}`}
                                >
                                    Annuler
                                </button>
                                <button 
                                    onClick={() => confirmWithdrawSubmission(confirmWithdraw)}
                                    className={`px-4 py-2 rounded ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}
                                >
                                    Confirmer le retrait
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal pour visualiser les détails d'un sujet */}
                {viewingSubjectDetails && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg max-w-2xl w-full`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {viewingSubjectDetails.title}
                                </h3>
                                <button 
                                    onClick={closeViewingDetails}
                                    className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                                >
                                    <X className={`h-6 w-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                                </button>
                            </div>
                            
                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                <div>
                                    <p className="font-semibold">Matière :</p>
                                    <p>{viewingSubjectDetails.subject}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Date de publication :</p>
                                    <p>{formatDate(viewingSubjectDetails.date)}</p>
                                </div>
                                <div>
                                    <p className="font-semibold">Date limite :</p>
                                    <p className={`${isDeadlineClose(viewingSubjectDetails.deadline) ? (darkMode ? 'text-yellow-300' : 'text-yellow-600') : ''}`}>
                                        {formatDate(viewingSubjectDetails.deadline)}
                                        {isDeadlineClose(viewingSubjectDetails.deadline) && ' (Bientôt!)'}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold">Statut :</p>
                                    <p className={viewingSubjectDetails.isSubmitted 
                                        ? (darkMode ? 'text-green-300' : 'text-green-600') 
                                        : (darkMode ? 'text-red-300' : 'text-red-600')}>
                                        {viewingSubjectDetails.isSubmitted ? 'Devoir rendu' : 'Devoir non rendu'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                <p className="font-semibold mb-2">Description :</p>
                                <p>{viewingSubjectDetails.description}</p>
                            </div>
                            
                            <div className="flex justify-end gap-2">
                                <button 
                                    onClick={() => openPdfViewer(viewingSubjectDetails)}
                                    className={`flex items-center px-4 py-2 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                                >
                                    <Eye className="mr-2 h-5 w-5" />
                                    Voir le PDF
                                </button>
                                <button 
                                    onClick={() => downloadSubject(viewingSubjectDetails.id)}
                                    className={`flex items-center px-4 py-2 rounded ${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white`}
                                >
                                    <Download className="mr-2 h-5 w-5" />
                                    Télécharger
                                </button>
                                <button 
                                    onClick={closeViewingDetails}
                                    className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} ${darkMode ? 'text-white' : 'text-gray-800'}`}
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal pour visualiser un PDF */}
                {viewingPdf && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-lg w-11/12 h-5/6`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {viewingPdf.title}
                                </h3>
                                <button 
                                    onClick={closeViewingPdf}
                                    className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                                >
                                    <X className={`h-6 w-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                                </button>
                            </div>
                            
                            <div className="w-full h-5/6 bg-gray-100 rounded">
                                {/* Simuler un PDF viewer ici */}
                                <div className="h-full flex items-center justify-center">
                                    <iframe 
                                        src={viewingPdf.pdfUrl} 
                                        className="w-full h-full rounded" 
                                        title={`PDF - ${viewingPdf.title}`}
                                    >
                                        Votre navigateur ne prend pas en charge l'affichage des PDF.
                                    </iframe>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-4">
                                <button 
                                    onClick={() => downloadSubject(viewingPdf.id)}
                                    className={`flex items-center px-4 py-2 rounded ${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white`}
                                >
                                    <Download className="mr-2 h-5 w-5" />
                                    Télécharger
                                </button>
                                <button 
                                    onClick={closeViewingPdf}
                                    className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} ${darkMode ? 'text-white' : 'text-gray-800'}`}
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