import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useDropzone } from "react-dropzone";

const data = [
  { name: "Classe A", moyenne: 15 },
  { name: "Classe B", moyenne: 18 },
  { name: "Classe C", moyenne: 12 },
  { name: "Classe D", moyenne: 20 },
];

export default function ProfessorDashboard() {
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
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Navigation */}
      <div className="flex justify-center space-x-4 mb-6 bg-white p-4 shadow-md rounded-xl">
        <button onClick={() => setActiveTab("depot")} className={activeTab === "depot" ? "bg-blue-600 text-white px-4 py-2 rounded" : "bg-gray-300 px-4 py-2 rounded"}>
          📤 Dépôt de sujets et corrections
        </button>
        <button onClick={() => setActiveTab("corrections")} className={activeTab === "corrections" ? "bg-green-600 text-white px-4 py-2 rounded" : "bg-gray-300 px-4 py-2 rounded"}>
          📝 Gestion des corrections
        </button>
        <button onClick={() => setActiveTab("stats")} className={activeTab === "stats" ? "bg-purple-600 text-white px-4 py-2 rounded" : "bg-gray-300 px-4 py-2 rounded"}>
          📊 Statistiques
        </button>
      </div>
      
      {/* Contenu dynamique selon l'onglet actif */}
      <div className="max-w-4xl mx-auto bg-white p-6 shadow-lg rounded-2xl">
        {activeTab === "depot" && (
          <div>
            <h2 className="text-3xl font-semibold text-blue-700 mb-4">📤 Dépôt de sujets et modèles de correction</h2>
            <p className="text-gray-600 mb-4">Sélectionnez une classe et déposez les fichiers :</p>
            <input type="text" placeholder="Nom de la classe" className="mb-4 p-2 border rounded-lg w-full" />
            
            <div {...getSubjectProps()} className="p-6 border-dashed border-4 border-blue-500 bg-blue-100 text-center cursor-pointer rounded-lg mb-4">
              <input {...getSubjectInputProps()} />
              {fileSubject ? <p className="text-lg font-medium text-gray-700">{fileSubject.name}</p> : <p className="text-lg font-medium">Glissez-déposez un sujet ici ou cliquez pour en sélectionner un.</p>}
            </div>
            
            <div {...getCorrectionProps()} className="p-6 border-dashed border-4 border-green-500 bg-green-100 text-center cursor-pointer rounded-lg mb-4">
              <input {...getCorrectionInputProps()} />
              {fileCorrection ? <p className="text-lg font-medium text-gray-700">{fileCorrection.name}</p> : <p className="text-lg font-medium">Glissez-déposez un modèle de correction ici ou cliquez pour en sélectionner un.</p>}
            </div>
            
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg">
              ✅ Déposer les fichiers
            </button>
          </div>
        )}
        
        {activeTab === "corrections" && (
          <div>
            <h2 className="text-3xl font-semibold text-green-700 mb-4">📝 Gestion des corrections</h2>
            <p className="text-gray-600 mb-4">L'IA corrige automatiquement les copies en 1 minute :</p>
            <ul className="space-y-2">
              <li className="p-3 border rounded-lg bg-green-100">Classe A - Étudiant 1 - Note attribuée par l'IA : 16/20 ✅</li>
              <li className="p-3 border rounded-lg bg-green-100">Classe B - Étudiant 2 - Note attribuée par l'IA : 14/20 ✏️</li>
              <li className="p-3 border rounded-lg bg-green-100">Classe C - Étudiant 3 - Note attribuée par l'IA : 19/20 ✅</li>
            </ul>
          </div>
        )}
        
        {activeTab === "stats" && (
          <div>
            <h2 className="text-3xl font-semibold text-purple-700 mb-4">📊 Statistiques par classe</h2>
            <p className="text-gray-600 mb-4">Analyse des performances des étudiants par classe :</p>
            <LineChart width={600} height={300} data={data}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 20]} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="moyenne" stroke="#7E57C2" strokeWidth={3} />
            </LineChart>
          </div>
        )}
      </div>
    </div>
  );
}
