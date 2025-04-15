import { useRef } from 'react';
import { Pie } from "react-chartjs-2";
import { Chart as ChartJs, ArcElement, Tooltip, Legend, Title } from "chart.js";
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { PieChartData } from "./FAKE_DATA";

ChartJs.register(ArcElement, Tooltip, Legend, Title);

export const PieChart = ({ data, title = "Distribution" }) => {
  const chartRef = useRef(null);
  const chartContent = data || PieChartData;

  const handleDownload = async () => {
    if (!chartRef.current) return;
    
    try {
      const dataUrl = await htmlToImage.toPng(chartRef.current, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
      });
      const dateStr = new Date().toISOString().slice(0, 10);
      saveAs(dataUrl, `pie_chart_${title.replace(/\s+/g, '_')}_${dateStr}.png`);
    } catch (error) {
      console.error('Error saving chart:', error);
    }
  };

  // Prepare chart data
  const chartData = {
    labels: chartContent?.plot_data?.labels || PieChartData.plot_data.labels,
    datasets: [{
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
    }],
  };

  // Calculate comprehensive statistics
  const values = chartData.datasets[0].data;
  const labels = chartData.labels;
  const total = values.reduce((sum, value) => sum + value, 0);
  
  // Create array of categories with their values and percentages
  const categories = labels.map((label, index) => ({
    label,
    value: values[index],
    percentage: Math.round((values[index] / total) * 100)
  }));
  
  // Sort categories by value (descending)
  const sortedCategories = [...categories].sort((a, b) => b.value - a.value);
  
  const topCategory = sortedCategories[0];
  const bottomCategory = sortedCategories[sortedCategories.length - 1];
  
  // Calculate distribution metrics
  const aboveAverageCategories = categories.filter(cat => cat.percentage > (100 / categories.length));
  const dominantCategories = sortedCategories.slice(0, 3); // Top 3 categories
  const minorCategories = sortedCategories.slice(-3); // Bottom 3 categories

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: title },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg shadow-md">

          <button
            onClick={handleDownload}
            className="z-10 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-sm flex items-center transition-colors"
            title="Download chart as PNG"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Save
          </button>
      <div ref={chartRef} className="w-full h-full justify-end bg-white flex ">
        <div className='w-1/2 h-full'>
          <Pie options={options} data={chartData} className="w-full h-full" />
        </div>
        
        {/* Detailed Summary Section */}
        <div className="flex justify-end p-4 bg-gray-50 border border-gray-200">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Metrics */}
            <div className="space-y-3">
            <h3 className="font-medium text-gray-800 mb-3 text-lg">Distribution Summary</h3>
              <div className="p-3 bg-white rounded-md shadow-sm">
                <h4 className="font-medium text-gray-700 mb-2">Overview</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total items:</span>
                    <span className="font-medium">{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categories:</span>
                    <span className="font-medium">{labels.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average per category:</span>
                    <span className="font-medium">{(total / labels.length).toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-md shadow-sm">
                <h4 className="font-medium text-gray-700 mb-2">Top Category</h4>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: chartData.datasets[0].backgroundColor[0] }} />
                  <span className="font-medium">{topCategory.label}</span>
                </div>
                <div className="mt-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Value:</span>
                    <span>{topCategory.value.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Percentage:</span>
                    <span>{topCategory.percentage}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution Insights */}
            <div className="space-y-3">
              <div className="p-3 bg-white rounded-md shadow-sm">
                <h4 className="font-medium text-gray-700 mb-2">Dominant Categories</h4>
                <div className="space-y-2">
                  {dominantCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }} />
                        <span>{category.label}</span>
                      </div>
                      <span className="font-medium">{category.percentage}%</span>
                    </div>
                  ))}
                  <div className="pt-1 mt-1 border-t border-gray-100 text-xs text-gray-500">
                    Combined: {dominantCategories.reduce((sum, cat) => sum + cat.percentage, 0)}% of total
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-md shadow-sm">
                <h4 className="font-medium text-gray-700 mb-2">Distribution Balance</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categories above average:</span>
                    <span>{aboveAverageCategories.length} of {labels.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Smallest category:</span>
                    <span>{bottomCategory.label} ({bottomCategory.percentage}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Top 3 share:</span>
                    <span>{dominantCategories.reduce((sum, cat) => sum + cat.percentage, 0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {chartContent?.column_stats && chartContent.column_names && (
            <div className="mt-3 text-xs text-gray-500 italic">
              Data note: Showing {chartContent.column_stats[chartContent.column_names[0]]?.unique_values} unique values
              {chartContent.column_stats[chartContent.column_names[0]]?.null_values > 0 && 
                ` (with ${chartContent.column_stats[chartContent.column_names[0]]?.null_values} null values)`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};