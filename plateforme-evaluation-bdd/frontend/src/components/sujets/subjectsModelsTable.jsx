import { useState, useEffect, useRef } from "react";
import { Download, Eye, UploadCloud } from "lucide-react";
import { useTheme } from "@/context/ThemeContext"; // ou '../context/ThemeContext'

const SubjectsModelsTable = () => {
    const { darkMode } = useTheme();
    const [subjects, setSubjects] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            const fakeData = [
                { id: 1, title: "Sujet 1", date: "2024-04-03", fileUrl: "/files/sujet1.pdf" },
                { id: 2, title: "Sujet 2", date: "2024-03-28", fileUrl: "/files/sujet2.pdf" },
            ];
            setSubjects(fakeData);
        };
        fetchSubjects();
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file.name);
        } else {
            alert("Veuillez sélectionner un fichier PDF.");
        }
    };

    // Classes dynamiques
    const containerClasses = `p-6 rounded-xl shadow-lg transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
    }`;

    const tableHeaderClasses = `${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`;
    const tableRowClasses = `border-b ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`;
    const iconClasses = "transition cursor-pointer hover:opacity-80";

    return (
        <div className={containerClasses}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                📜 Sujets déposés
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className={`${tableHeaderClasses} border-b`}>
                            <th className="p-4 text-left">Titre</th>
                            <th className="p-4 text-left">Date</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.length > 0 ? (
                            subjects.map((subject) => (
                                <tr key={subject.id} className={`${tableRowClasses} transition-colors duration-200`}>
                                    <td className="p-4">{subject.title}</td>
                                    <td className="p-4">{subject.date}</td>
                                    <td className="p-4 text-center flex justify-center gap-6">
                                        <a href={subject.fileUrl} target="_blank" rel="noopener noreferrer">
                                            <Eye size={22} className={`text-blue-400 ${iconClasses}`} />
                                        </a>
                                        <a href={subject.fileUrl} download>
                                            <Download size={22} className={`text-green-400 ${iconClasses}`} />
                                        </a>
                                        <UploadCloud 
                                            size={22} 
                                            className={`text-yellow-400 ${iconClasses}`} 
                                            onClick={() => fileInputRef.current.click()} 
                                        />
                                        <input 
                                            type="file" 
                                            accept="application/pdf" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            onChange={handleFileChange}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className={`p-4 text-center italic ${
                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    Aucun sujet déposé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedFile && (
                <p className={`mt-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    📄 Fichier sélectionné : <span className="text-green-400 font-semibold">{selectedFile}</span>
                </p>
            )}
        </div>
    );
};

export default SubjectsModelsTable;