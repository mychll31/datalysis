import { Pie } from "react-chartjs-2";
import { Chart as ChartJs, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { PieChartData } from "./FAKE_DATA"; // Importing fake data

ChartJs.register(ArcElement, Tooltip, Legend, Title);

export const PieChart = () => {
    const options = {
        responsive: true,
        plugins: { 
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Pie Chart Example",
            },
        },
    };

    return <Pie options={options} data={PieChartData} />;
};
