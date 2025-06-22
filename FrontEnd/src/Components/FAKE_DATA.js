import { useState, useEffect } from 'react';

const API_BASE_URL = "https://datalysis.onrender.com";
console.log("ALL ENV:", import.meta.env);
console.log("API base URL:", API_BASE_URL)

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

export const usePieChartData = (file, targetColumn) => {
  const [pieData, setPieData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (file && targetColumn) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('target_column1', targetColumn);
          formData.append('output_type', 'pie');

          const response = await fetch(`${API_BASE_URL}api/upload_csv/`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          // Transform the backend response to match our frontend format
          const transformedData = {
            status: data.status,
            data_source_type: data.data_source_type,
            plot_data: {
              labels: data.plot_data.labels,
              values: data.plot_data.values
            },
            column_names: data.column_names,
            column_stats: data.column_stats
          };

          setPieData(transformedData);
        } catch (err) {
          setError(err.message || 'Failed to analyze data');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [file, targetColumn]);

  return { pieData, loading, error };
};

export const PieChartData = {
  status: 'success',
  data_source_type: 'csv',
  plot_data: {
    labels: ["Category A", "Category B", "Category C"],
    values: [45, 30, 25]
  },
  column_names: ['category'],
  column_stats: {
    category: {
      type: 'categorical',
      unique_values: 3,
      null_count: 0
    }
  }
};
