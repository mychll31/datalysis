import React, { useRef } from 'react';
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
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';

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
  const chartRef = useRef(null);

  // Safety check: if data, plot_data, or column_names is missing, return fallback UI
  if (!data || !data.plot_data || !data.column_names) {
    return <div>No relationship data available</div>;
  }

  const { 
    plot_data, 
    relationship_type, 
    correlation, 
    column_names, 
    model_performance,
    statistical_tests
  } = data;

  const handleDownload = async () => {
    if (!chartRef.current) return;
    
    try {
      const chartElement = chartRef.current;
      
      // Increase quality by scaling up
      const dataUrl = await htmlToImage.toPng(chartElement, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
        style: {
          padding: '0px',
          borderRadius: '8px'
        }
      });
      
      // Generate filename with current date
      const dateStr = new Date().toISOString().slice(0, 10);
      const filename = `chart_${column_names[0]}_vs_${column_names[1]}_${dateStr}.png`;
      
      saveAs(dataUrl, filename);
    } catch (error) {
      console.error('Error saving chart:', error);
    }
  };

  // Safely prepare actual data from plot_data
  const actualData = (plot_data && Array.isArray(plot_data.x) && Array.isArray(plot_data.y))
    ? plot_data.x.map((xVal, i) => ({ x: xVal, y: plot_data.y[i] }))
    : [];

  const chartData = {
    datasets: [
      {
        label: 'Actual Data',
        data: actualData,
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
      return `Correlation: ${correlation ? correlation.toFixed(2) : 'N/A'}`;
    } else if (relationship_type === 'numeric-categorical') {
      if (statistical_tests?.anova) {
        return `ANOVA p-value: ${statistical_tests.anova.p_value.toFixed(4)}`;
      }
      return `Point-Biserial: ${correlation ? correlation.toFixed(2) : 'N/A'}`;
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
            return `${label}: ${value.y ? value.y.toFixed(2) : value.y}`;
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
    <div className="relative bg-white p-6 rounded-lg shadow-md w-full h-[500px]">
      {/* Download button positioned at top-right */}
      <button
        onClick={handleDownload}
        className="absolute top-4 right-4 z-10 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-sm flex items-center transition-colors"
        title="Download chart as PNG"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Save
      </button>

      {/* Chart container with ref for capturing */}
      <div ref={chartRef} className="chart-container">
        {relationship_type === 'numeric-numeric' ? (
          <Scatter 
            data={chartData} 
            options={options} 
            style={{ width: '100%', height: '450px' }} 
          />
        ) : (
          <Bar 
            data={chartData} 
            options={options}
            style={{ width: '100%', height: '450px' }} 
          />
        )}
      </div>
    </div>
  );
};