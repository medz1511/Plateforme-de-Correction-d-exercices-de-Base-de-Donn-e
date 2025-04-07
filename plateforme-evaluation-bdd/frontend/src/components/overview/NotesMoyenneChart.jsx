import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "@/context/ThemeContext";

const data = [
  { name: "Devoir 1", note: 16 },
  { name: "Devoir 2", note: 14 },
  { name: "Devoir 3", note: 15 },
  { name: "Devoir 4", note: 17 },
];

const NotesMoyenneChart = () => {
  const { darkMode } = useTheme();

  // Couleurs dynamiques
  const lineColor = darkMode ? "#F472B6" : "#EC4899"; // Rose plus clair en dark mode
  const textColor = darkMode ? "#E5E7EB" : "#1F2937";
  const gridColor = darkMode ? "#4B5563" : "#E5E7EB";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const tooltipBg = darkMode ? "#1F2937" : "#FFFFFF";

  return (
    <div className={`${cardBg} p-6 rounded-lg shadow transition-colors duration-300`}>
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Moyenne des Notes
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: textColor }}
          />
          <YAxis 
            tick={{ fill: textColor }}
            domain={[0, 20]} // Fixe l'échelle Y jusqu'à 20
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: darkMode ? "#4B5563" : "#E5E7EB",
              borderRadius: '0.5rem'
            }}
            itemStyle={{ color: textColor }}
            formatter={(value) => [`${value}/20`, "Note"]}
          />
          <Legend 
            wrapperStyle={{ color: textColor }}
          />
          <Line 
            type="monotone" 
            dataKey="note" 
            stroke={lineColor}
            strokeWidth={2}
            activeDot={{ 
              r: 8,
              stroke: lineColor,
              fill: darkMode ? "#1F2937" : "#FFFFFF"
            }}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NotesMoyenneChart;