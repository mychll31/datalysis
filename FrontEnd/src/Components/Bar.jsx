import { Bar } from "react-chartjs-2";
import { Chart as ChartJs, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { BarChartData } from "./FAKE_DATA";

ChartJs.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const BarGraph = () => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
            title: {
                display: true,
                text: BarChartData.datasets[0].label || "Chart Data",
                font: {
                    size: 18,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Bar options={options} data={BarChartData} />;
};