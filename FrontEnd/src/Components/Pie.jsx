import { useRef } from 'react';
import { Pie } from "react-chartjs-2";
import { Chart as ChartJs, ArcElement, Tooltip, Legend, Title } from "chart.js";
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { PieChartData } from "./FAKE_DATA";

ChartJs.register(ArcElement, Tooltip, Legend, Title);

export const PieChart = ({ data, title = "Distribution" }) => {
  const chartRef = useRef(null);

  // Use the provided data or fallback to default PieChartData
  const chartContent = data || PieChartData;

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
      const filename = `pie_chart_${title.replace(/\s+/g, '_')}_${dateStr}.png`;
      
      saveAs(dataUrl, filename);
    } catch (error) {
      console.error('Error saving chart:', error);
    }
  };

  // Prepare chart data structure with proper fallback access
  const chartData = {
    labels: chartContent?.plot_data?.labels || PieChartData.plot_data.labels,
    datasets: [
      {
        label: title,
        data: chartContent?.plot_data?.values || PieChartData.plot_data.values,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Calculate summary statistics
  const total = chartData.datasets[0].data.reduce((sum, value) => sum + value, 0);
  const topCategoryIndex = chartData.datasets[0].data.indexOf(Math.max(...chartData.datasets[0].data));
  const topCategory = chartData.labels[topCategoryIndex];
  const topCategoryValue = chartData.datasets[0].data[topCategoryIndex];
  const topCategoryPercentage = Math.round((topCategoryValue / total) * 100);

  return (
    <div className="relative w-full h-full bg-white p-4 rounded-lg shadow-md">
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
      <div ref={chartRef} className="w-full h-full">
        <Pie options={options} data={chartData} className="w-full h-full" />
        
        {/* Summary section */}
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-700 mb-2">Summary</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Total items:</span>
              <span className="font-medium ml-1">{total}</span>
            </div>
            <div>
              <span className="text-gray-500">Categories:</span>
              <span className="font-medium ml-1">{chartData.labels.length}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Top category:</span>
              <span className="font-medium ml-1">{topCategory} ({topCategoryValue} - {topCategoryPercentage}%)</span>
            </div>
          </div>
        </div>

        {chartContent?.column_stats && chartContent.column_names && (
          <div className="text-xs text-gray-500 mt-2">
            {`Showing ${chartContent.column_stats[chartContent.column_names[0]]?.unique_values} unique values`}
          </div>
        )}
      </div>
    </div>
  );
};