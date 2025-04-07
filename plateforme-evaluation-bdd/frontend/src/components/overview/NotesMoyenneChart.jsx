import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Exemple de données pour les moyennes des notes
const data = [
  { name: "Devoir 1", note: 16 },
  { name: "Devoir 2", note: 14 },
  { name: "Devoir 3", note: 15 },
  { name: "Devoir 4", note: 17 },
];

const NotesMoyenneChart = () => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Moyenne des Notes</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="note" stroke="#EC4899" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NotesMoyenneChart;
