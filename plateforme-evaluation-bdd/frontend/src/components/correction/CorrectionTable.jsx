import React from 'react';

const CorrectionTable = ({ results }) => {
  return (
    <div className="overflow-x-auto bg-gray-800 shadow-md rounded-lg"> {/* Fond gris foncé pour le conteneur du tableau */}
      <table className="min-w-full text-white"> {/* Texte en blanc pour contraster avec le fond sombre */}
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Subject</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Grade</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Max Grade</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'
              } hover:bg-gray-500`} // Variation de gris pour les lignes, avec survol plus clair
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{result.subject}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{result.grade}/20</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.maxGrade}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {result.grade >= 10 ? (
                  <span className="text-green-500 font-semibold">Passed</span>
                ) : (
                  <span className="text-red-500 font-semibold">Failed</span>
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
