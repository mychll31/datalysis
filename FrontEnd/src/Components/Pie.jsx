import { Pie } from "react-chartjs-2";
import { Chart as ChartJs, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { PieChartData } from "./FAKE_DATA";

ChartJs.register(ArcElement, Tooltip, Legend, Title);

export const PieChart = ({ data, title = "Distribution" }) => {
  // Use the provided data or fallback to default PieChartData
  const chartContent = data || PieChartData;

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

  return (
    <div className="w-full h-full">
      <Pie options={options} data={chartData} className="w-full h-full" />
      {chartContent?.column_stats && chartContent.column_names && (
        <div className="text-xs text-gray-500 mt-2">
          {`Showing ${chartContent.column_stats[chartContent.column_names[0]]?.unique_values} unique values`}
        </div>
      )}
    </div>
  );
};
