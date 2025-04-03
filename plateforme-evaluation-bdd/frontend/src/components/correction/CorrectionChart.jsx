import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const CorrectionChart = ({ results }) => {
  // Dégradé de couleurs modernes
  const colors = results.map((result) => 
    result.grade >= 10 
      ? 'rgba(59, 130, 246, 0.7)'  // Bleu élégant pour les bonnes notes
      : 'rgba(244, 114, 182, 0.7)' // Rose foncé pour les notes faibles
  );

  const borderColors = results.map((result) =>
    result.grade >= 10 
      ? 'rgba(37, 99, 235, 1)'  // Bordure bleu profond
      : 'rgba(236, 72, 153, 1)' // Bordure rose foncé
  );

  const chartData = {
    labels: results.map((result) => result.subject),
    datasets: [
      {
        label: 'Grades',
        data: results.map((result) => result.grade),
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: borderColors.map(color => color.replace('1', '0.8')),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permet d'adapter la taille au conteneur
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 20,
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        ticks: {
          stepSize: 5,
          font: {
            size: 14,
          },
          color: '#e2e8f0',
        },
      },
      x: {
        ticks: {
          font: {
            size: 14,
          },
          color: '#e2e8f0',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 14,
          },
          color: '#f8fafc',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 14,
        },
        bodyColor: '#fff',
      },
    },
  };

  return (
    <div className="flex justify-center items-center w-full min-h-[400px]"> 
      <div className="bg-gray-900 shadow-lg rounded-xl p-6 w-full max-w-4xl h-[400px] sm:h-[500px] md:h-[600px]"> 
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CorrectionChart;
