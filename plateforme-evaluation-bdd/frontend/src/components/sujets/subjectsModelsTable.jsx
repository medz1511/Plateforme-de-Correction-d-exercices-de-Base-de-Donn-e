import { useState, useEffect, useRef } from "react";
import { Download, Eye, UploadCloud } from "lucide-react";

const SubjectsModelsTable = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    // Simuler un appel API pour récupérer les sujets déposés
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

    // Gérer la sélection d'un fichier
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file.name);
        } else {
            alert("Veuillez sélectionner un fichier PDF.");
        }
    };

    return (
        <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">📜 Sujets déposés</h2>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-800 border-b border-gray-700">
                            <th className="p-4 text-left">Titre</th>
                            <th className="p-4 text-left">Date</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.length > 0 ? (
                            subjects.map((subject) => (
                                <tr key={subject.id} className="border-b border-gray-700 hover:bg-gray-800 transition">
                                    <td className="p-4">{subject.title}</td>
                                    <td className="p-4">{subject.date}</td>
                                    <td className="p-4 text-center flex justify-center gap-6">
                                        <a href={subject.fileUrl} target="_blank" rel="noopener noreferrer">
                                            <Eye size={22} className="text-blue-400 hover:text-blue-500 transition cursor-pointer" />
                                        </a>
                                        <a href={subject.fileUrl} download>
                                            <Download size={22} className="text-green-400 hover:text-green-500 transition cursor-pointer" />
                                        </a>
                                        <UploadCloud 
                                            size={22} 
                                            className="text-yellow-400 hover:text-yellow-500 transition cursor-pointer" 
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
                                <td colSpan="3" className="p-4 text-center text-gray-400 italic">
                                    Aucun sujet déposé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedFile && (
                <p className="mt-4 text-center text-gray-300">
                    📄 Fichier sélectionné : <span className="text-green-400 font-semibold">{selectedFile}</span>
                </p>
            )}
        </div>
    );
};

export default SubjectsModelsTable;
