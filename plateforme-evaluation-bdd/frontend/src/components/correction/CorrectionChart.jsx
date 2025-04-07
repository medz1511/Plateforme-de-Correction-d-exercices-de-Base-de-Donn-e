import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const CorrectionChart = ({ results }) => {
  const { darkMode } = useTheme();

  // Couleurs adaptatives selon le thème
  const colors = results.map((result) => 
    result.grade >= 10 
      ? darkMode 
        ? 'rgba(99, 102, 241, 0.7)'   // Indigo en mode sombre
        : 'rgba(59, 130, 246, 0.7)'    // Bleu en mode clair
      : darkMode 
        ? 'rgba(244, 114, 182, 0.7)'   // Rose en mode sombre
        : 'rgba(236, 72, 153, 0.7)'    // Rose plus clair
  );

  const borderColors = results.map((result) =>
    result.grade >= 10 
      ? darkMode 
        ? 'rgba(79, 70, 229, 1)'       // Indigo foncé en mode sombre
        : 'rgba(37, 99, 235, 1)'        // Bleu foncé en mode clair
      : darkMode 
        ? 'rgba(219, 39, 119, 1)'      // Rose foncé en mode sombre
        : 'rgba(236, 72, 153, 1)'       // Rose en mode clair
  );

  const chartData = {
    labels: results.map((result) => result.subject),
    datasets: [
      {
        label: 'Notes',
        data: results.map((result) => result.grade),
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: borderColors.map(color => color.replace('1', '0.8')),
      },
    ],
  };

  // Options adaptatives selon le thème
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 20,
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          stepSize: 5,
          font: {
            size: 14,
          },
          color: darkMode ? '#e2e8f0' : '#4b5563',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
          },
          color: darkMode ? '#e2e8f0' : '#4b5563',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
          color: darkMode ? '#f8fafc' : '#111827',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 14,
        },
        titleColor: darkMode ? '#f3f4f6' : '#111827',
        bodyColor: darkMode ? '#f3f4f6' : '#111827',
        borderColor: darkMode ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div className="flex justify-center items-center w-full min-h-[400px]"> 
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-xl p-6 w-full max-w-4xl h-[400px] sm:h-[500px] md:h-[600px] transition-colors duration-300`}> 
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CorrectionChart;