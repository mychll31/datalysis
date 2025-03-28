import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  Title,
  Filler
} from 'chart.js';
import { Scatter, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  Title,
  Filler
);

export const RelationshipChart = ({ data }) => {
  const { 
    plot_data, 
    relationship_type, 
    correlation, 
    column_names, 
    model_performance,
    statistical_tests
  } = data;

  // Prepare data - only actual points, no trend line
  const chartData = {
    datasets: [
      {
        label: 'Actual Data',
        data: plot_data.x.map((xVal, i) => ({ x: xVal, y: plot_data.y[i] })),
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointRadius: 6,
        pointHoverRadius: 10,
        pointBorderWidth: 2,
        pointBorderColor: '#fff'
      }
    ]
  };

  // Build dynamic subtitle with relevant metrics
  const buildSubtitle = () => {
    if (relationship_type === 'numeric-numeric') {
      return `Correlation: ${correlation?.toFixed(2) || 'N/A'}`;
    }
    else if (relationship_type === 'numeric-categorical') {
      if (statistical_tests?.anova) {
        return `ANOVA p-value: ${statistical_tests.anova.p_value.toFixed(4)}`;
      }
      return `Point-Biserial: ${correlation?.toFixed(2) || 'N/A'}`;
    }
    return '';
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `${column_names[0]} vs ${column_names[1]}`,
        font: { 
          size: 18,
          weight: 'bold'
        },
        padding: { top: 10, bottom: 5 }
      },
      subtitle: {
        display: true,
        text: buildSubtitle(),
        font: { size: 14 },
        color: '#666',
        padding: { bottom: 20 }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed;
            return `${label}: ${value.y?.toFixed(2) || value.y}`;
          }
        }
      },
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 20,
          usePointStyle: true
        }
      }
    },
    scales: {
      x: {
        title: { 
          display: true, 
          text: column_names[0],
          font: { weight: 'bold' }
        },
        type: relationship_type === 'numeric-numeric' ? 'linear' : 'category',
        grid: {
          display: false
        }
      },
      y: {
        title: { 
          display: true, 
          text: column_names[1],
          font: { weight: 'bold' }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full h-[500px]">
      {relationship_type === 'numeric-numeric' ? (
        <Scatter 
          data={chartData} 
          options={options} 
          style={{ width: '100%', height: '100%' }} 
        />
      ) : (
        <Bar 
          data={chartData} 
          options={options}
          style={{ width: '100%', height: '100%' }} 
        />
      )}
    </div>
  );
};