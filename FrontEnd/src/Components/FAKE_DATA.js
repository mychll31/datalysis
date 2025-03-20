export const LineChartData = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "Steps",
        data: [3000, 5000, 4500, 6000, 8000, 7000, 9000],
        borderColor: "rgb(75, 192, 192)",
      },
    ],
  };

export const PieChartData = {
    labels: ["Plastic", "Metal", "Glass", "Paper", "Organic Waste", "Others"], // Waste categories
    datasets: [
        {
            label: "Waste Collected (%)",
            data: [35, 20, 15, 10, 12, 8], // Example percentages
            backgroundColor: [
                "rgba(255, 99, 132, 0.6)",   // Red (Plastic)
                "rgba(54, 162, 235, 0.6)",   // Blue (Metal)
                "rgba(255, 206, 86, 0.6)",   // Yellow (Glass)
                "rgba(75, 192, 192, 0.6)",   // Green (Paper)
                "rgba(153, 102, 255, 0.6)",  // Purple (Organic Waste)
                "rgba(255, 159, 64, 0.6)",   // Orange (Others)
            ],
            borderColor: ["#fff"],
            borderWidth: 1,
        },
    ],
};

export const BarChartData = {
    labels: ["January", "February", "March", "April", "May", "June"], // X-axis labels
    datasets: [
        {
            label: "Waste Collected (kg)", // Dataset label
            data: [120, 150, 100, 180, 130, 160], // Example dataset values
            backgroundColor: [
                "rgba(255, 99, 132, 0.6)",  
                "rgba(54, 162, 235, 0.6)",  
                "rgba(255, 206, 86, 0.6)",  
                "rgba(75, 192, 192, 0.6)",  
                "rgba(153, 102, 255, 0.6)",  
                "rgba(255, 159, 64, 0.6)",  
            ],
            borderColor: ["#fff"],
            borderWidth: 1,
        },
    ],
};
