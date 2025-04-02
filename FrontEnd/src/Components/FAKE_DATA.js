export const useRelationshipData = (file, targetColumns) => {
    const [relationshipData, setRelationshipData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (file && targetColumns && targetColumns.length >= 2) {
        const fetchData = async () => {
          setLoading(true);
          setError(null);
          try {
            const data = await analyzeData(file, targetColumns[0], targetColumns[1]);
            setRelationshipData(data);
          } catch (err) {
            setError(err.message || 'Failed to analyze data');
          } finally {
            setLoading(false);
          }
        };
  
        fetchData();
      }
    }, [file, targetColumns]);
  
    return { relationshipData, loading, error };
  };
  
  export const RelationshipData = {
    status: 'success',
    data_source_type: 'csv',
    relationship_type: 'numeric-numeric',
    correlation: 0.85,
    plot_data: {
      x: [1, 2, 3, 4, 5],
      y: [2, 4, 5, 4, 5],
      predicted: [1.8, 3.2, 4.6, 4.0, 5.4],
      confidence_interval: {
        upper: [2.1, 3.5, 4.9, 4.3, 5.7],
        lower: [1.5, 2.9, 4.3, 3.7, 5.1]
      }
    },
    column_names: ['feature', 'target'],
    column_stats: {
      feature: {
        type: 'numeric',
        unique_values: 5,
        null_count: 0
      },
      target: {
        type: 'numeric',
        unique_values: 3,
        null_count: 0
      }
    },
    statistical_tests: null,
    model_performance: {
      model_type: 'H2ORegressionModel',
      r2: 0.92,
      rmse: 0.45,
      mae: 0.38
    }
  };
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
