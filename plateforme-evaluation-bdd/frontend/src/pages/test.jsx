import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useDropzone } from "react-dropzone";
import { useTheme } from "../context/ThemeContext";

const data = [
  { name: "Classe A", moyenne: 15 },
  { name: "Classe B", moyenne: 18 },
  { name: "Classe C", moyenne: 12 },
  { name: "Classe D", moyenne: 20 },
];

export default function ProfessorDashboard() {
  const { darkMode } = useTheme();
  const [fileSubject, setFileSubject] = useState(null);
  const [fileCorrection, setFileCorrection] = useState(null);
  const [activeTab, setActiveTab] = useState("depot");

  const { getRootProps: getSubjectProps, getInputProps: getSubjectInputProps } = useDropzone({
    accept: "application/pdf",
    onDrop: (acceptedFiles) => setFileSubject(acceptedFiles[0]),
  });
  
  const { getRootProps: getCorrectionProps, getInputProps: getCorrectionInputProps } = useDropzone({
    accept: "application/pdf",
    onDrop: (acceptedFiles) => setFileCorrection(acceptedFiles[0]),
  });

  return (
    <div className={`p-6 min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
      <div className={`flex justify-center space-x-4 mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
        <button 
          onClick={() => setActiveTab("depot")} 
          className={`px-4 py-2 rounded transition-colors ${activeTab === "depot" ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
        >
          📤 Dépôt de sujets et corrections
        </button>
        <button 
          onClick={() => setActiveTab("corrections")} 
          className={`px-4 py-2 rounded transition-colors ${activeTab === "corrections" ? darkMode ? 'bg-green-600 text-white' : 'bg-green-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
        >
          📝 Gestion des corrections
        </button>
        <button 
          onClick={() => setActiveTab("stats")} 
          className={`px-4 py-2 rounded transition-colors ${activeTab === "stats" ? darkMode ? 'bg-purple-600 text-white' : 'bg-purple-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
        >
          📊 Statistiques
        </button>
      </div>
      
      <div className={`max-w-4xl mx-auto p-6 rounded-2xl ${darkMode ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-lg'}`}>
        {activeTab === "depot" && (
          <div>
            <h2 className={`text-3xl font-semibold mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
              📤 Dépôt de sujets et modèles de correction
            </h2>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Sélectionnez une classe et déposez les fichiers :
            </p>
            <input 
              type="text" 
              placeholder="Nom de la classe" 
              className={`mb-4 p-2 rounded-lg w-full ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'} border`} 
            />
            
            <div 
              {...getSubjectProps()} 
              className={`p-6 border-dashed border-4 text-center cursor-pointer rounded-lg mb-4 ${darkMode ? 'border-blue-500 bg-blue-900/20' : 'border-blue-500 bg-blue-100'}`}
            >
              <input {...getSubjectInputProps()} />
              {fileSubject ? (
                <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{fileSubject.name}</p>
              ) : (
                <p className="text-lg font-medium">Glissez-déposez un sujet ici ou cliquez pour en sélectionner un.</p>
              )}
            </div>
            
            <div 
              {...getCorrectionProps()} 
              className={`p-6 border-dashed border-4 text-center cursor-pointer rounded-lg mb-4 ${darkMode ? 'border-green-500 bg-green-900/20' : 'border-green-500 bg-green-100'}`}
            >
              <input {...getCorrectionInputProps()} />
              {fileCorrection ? (
                <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{fileCorrection.name}</p>
              ) : (
                <p className="text-lg font-medium">Glissez-déposez un modèle de correction ici ou cliquez pour en sélectionner un.</p>
              )}
            </div>
            
            <button className={`w-full py-2 rounded-lg font-semibold ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors`}>
              ✅ Déposer les fichiers
            </button>
          </div>
        )}
        
        {activeTab === "corrections" && (
          <div>
            <h2 className={`text-3xl font-semibold mb-4 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
              📝 Gestion des corrections
            </h2>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              L'IA corrige automatiquement les copies en 1 minute :
            </p>
            <ul className="space-y-2">
              <li className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'}`}>
                Classe A - Étudiant 1 - Note attribuée par l'IA : 16/20 ✅
              </li>
              <li className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'}`}>
                Classe B - Étudiant 2 - Note attribuée par l'IA : 14/20 ✏️
              </li>
              <li className={`p-3 rounded-lg ${darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'}`}>
                Classe C - Étudiant 3 - Note attribuée par l'IA : 19/20 ✅
              </li>
            </ul>
          </div>
        )}
        
        {activeTab === "stats" && (
          <div>
            <h2 className={`text-3xl font-semibold mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
              📊 Statistiques par classe
            </h2>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Analyse des performances des étudiants par classe :
            </p>
            <LineChart 
              width={600} 
              height={300} 
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis 
                dataKey="name" 
                stroke={darkMode ? "#D1D5DB" : "#4B5563"} 
              />
              <YAxis 
                stroke={darkMode ? "#D1D5DB" : "#4B5563"} 
                domain={[0, 20]} 
              />
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={darkMode ? "#4B5563" : "#E5E7EB"} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? "#1F2937" : "#F3F4F6", 
                  borderColor: darkMode ? "#4B5563" : "#D1D5DB",
                  color: darkMode ? "#F3F4F6" : "#111827"
                }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="moyenne" 
                stroke="#7E57C2" 
                strokeWidth={3} 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </div>
        )}
      </div>
    </div>
  );
}