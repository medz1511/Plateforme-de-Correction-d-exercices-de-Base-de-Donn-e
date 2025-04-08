import React from 'react';
import { useTheme } from '@/context/ThemeContext';

const CorrectionTable = ({ results, darkMode }) => {
  return (
    <div className={`overflow-x-auto shadow-md rounded-lg transition-colors duration-300 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <table className="min-w-full">
        <thead>
          <tr className={darkMode ? 'bg-gray-700' : 'bg-gray-100'}>
            <th className={`px-6 py-3 text-left text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Subject</th>
            <th className={`px-6 py-3 text-left text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Grade</th>
            <th className={`px-6 py-3 text-left text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Max Grade</th>
            <th className={`px-6 py-3 text-left text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Status</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr
              key={index}
              className={`${
                darkMode 
                  ? index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'
                  : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } ${
                darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
              } transition-colors duration-200`}
            >
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {result.subject}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {result.grade}/20
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {result.maxGrade}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {result.grade >= 10 ? (
                  <span className={`${
                    darkMode ? 'text-green-400' : 'text-green-600'
                  } font-semibold`}>
                    Passed
                  </span>
                ) : (
                  <span className={`${
                    darkMode ? 'text-red-400' : 'text-red-600'
                  } font-semibold`}>
                    Failed
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CorrectionTable;