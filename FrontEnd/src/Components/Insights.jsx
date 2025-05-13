import React from "react";
import JargonModal from "./JargonModal";
import { useState, useEffect } from "react";

// Enhanced helper functions with error handling and additional metrics

const computeStatistics = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return {};
  
  try {
    const numericValues = arr.filter(val => typeof val === 'number' && !isNaN(val));
    if (numericValues.length === 0) return {};
    
    const n = numericValues.length;
    const mean = numericValues.reduce((a, b) => a + b, 0) / n;
    const sorted = [...numericValues].sort((a, b) => a - b);
    const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
    const variance = numericValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;
    
    // Skewness calculation
    const skewness = n > 2 && stdDev !== 0 ? 
      (n / ((n - 1) * (n - 2))) * 
      numericValues.reduce((sum, x) => sum + Math.pow((x - mean) / stdDev, 3), 0) : 
      null;
    
    return { 
      mean, 
      median, 
      variance, 
      stdDev, 
      min, 
      max, 
      range, 
      skewness,
      sampleSize: n 
    };
  } catch (error) {
    console.error("Error computing statistics:", error);
    return {};
  }
};

const detectOutliers = (arr, method = "iqr") => {
  if (!Array.isArray(arr)) return 0;
  if (arr.length < 4) return 0;
  
  try {
    const numericValues = arr.filter(val => typeof val === 'number' && !isNaN(val));
    if (numericValues.length < 4) return 0;
    
    const sorted = [...numericValues].sort((a, b) => a - b);
    
    if (method === "iqr") {
      const q1 = sorted[Math.floor((sorted.length / 4))];
      const q3 = sorted[Math.floor((sorted.length * 3) / 4)];
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;
      return numericValues.filter((v) => v < lowerBound || v > upperBound).length;
    } else if (method === "zscore") {
      const { mean, stdDev } = computeStatistics(numericValues);
      if (stdDev === 0) return 0;
      return numericValues.filter(v => Math.abs((v - mean) / stdDev) > 3).length;
    }
    
    return 0;
  } catch (error) {
    console.error("Error detecting outliers:", error);
    return 0;
  }
};

const checkNormality = (stats) => {
  if (!stats || !stats.sampleSize || stats.sampleSize < 20) return "Insufficient data for normality assessment";
  if (stats.stdDev === 0) return "Constant data (no variation)";
  
  // Simple heuristic checks
  const meanMedianDiff = Math.abs(stats.mean - stats.median);
  const stdDevRatio = meanMedianDiff / stats.stdDev;
  
  if (stats.skewness === null) return "Normality assessment not available";
  
  if (stdDevRatio < 0.1 && Math.abs(stats.skewness) < 0.5) {
    return "Data appears approximately normally distributed";
  } else if (stats.skewness > 0.5) {
    return "Data appears right-skewed (positive skew)";
  } else if (stats.skewness < -0.5) {
    return "Data appears left-skewed (negative skew)";
  }
  
  return "Data shows some deviation from normality";
};

export const InsightComponent = ({ data = {}, config = {} }) => {
  // Safely destructure with defaults
  const {
    plot_data = {},
    relationship_type = "unknown",
    correlation = null,
    statistical_tests = {},
    model_performance = {},
    column_names = ["Variable 1", "Variable 2"]
  } = data;

  // Use column names for display if available
  const variable_names = {
    x: column_names[0] || "X",
    y: column_names[1] || "Y"
  };

  // Compute statistics with enhanced safety
  let summaryStats = {};
  let outlierCount = null;
  let normalityAssessment = "";
  
  if (relationship_type.includes("numeric") && Array.isArray(plot_data?.y)) {
    summaryStats = computeStatistics(plot_data.y);
    outlierCount = detectOutliers(plot_data.y, config.outlierMethod || "iqr");
    normalityAssessment = checkNormality(summaryStats);
  }

  // Generate actionable insights with more context
  const generateInsights = () => {
    let insights = [];

    // Basic information about the analysis
    if (plot_data?.y) {
      const sampleSize = summaryStats.sampleSize || (Array.isArray(plot_data.y) ? plot_data.y.length : 0);
      if (sampleSize > 0) {
        insights.push(`Analysis performed on ${sampleSize} data points.`);
      }
    }

    // Relationship-specific insights
    switch (relationship_type) {
      case "numeric-numeric":
        if (correlation !== null) {
          const absCorr = Math.abs(correlation);
          let strength, direction = correlation > 0 ? "positive" : "negative";
          
          if (absCorr > 0.9) strength = "very strong";
          else if (absCorr > 0.7) strength = "strong";
          else if (absCorr > 0.5) strength = "moderate";
          else if (absCorr > 0.3) strength = "weak";
          else strength = "very weak or no";
          
          insights.push(
            `There is a ${strength} ${direction} linear relationship (r = ${correlation.toFixed(2)}) between ${variable_names.x} and ${variable_names.y}.`
          );
        }

        if (Object.keys(summaryStats).length > 0) {
          insights.push(
            `For ${variable_names.y}: Mean = ${summaryStats.mean?.toFixed(2) || 'N/A'}, ` +
            `Median = ${summaryStats.median?.toFixed(2) || 'N/A'}, ` +
            `Std Dev = ${summaryStats.stdDev?.toFixed(2) || 'N/A'}, ` +
            `Range = [${summaryStats.min?.toFixed(2) || 'N/A'}, ${summaryStats.max?.toFixed(2) || 'N/A'}]`
          );
          
          if (summaryStats.skewness !== null) {
            insights.push(`Skewness: ${summaryStats.skewness.toFixed(2)} (${summaryStats.skewness > 0 ? "right" : "left"}-skewed)`);
          }
        }

        if (outlierCount !== null) {
          const percentage = plot_data.y?.length ? (outlierCount / plot_data.y.length * 100).toFixed(1) : 0;
          insights.push(
            `Detected ${outlierCount} potential outlier${outlierCount !== 1 ? "s" : ""} ` +
            `(${percentage}% of data).`
          );
        }

        if (normalityAssessment) {
          insights.push(normalityAssessment);
        }
        break;

      case "numeric-categorical":
      case "categorical-numeric":
        if (statistical_tests?.anova) {
          const { f_statistic, p_value } = statistical_tests.anova;
          const significance = p_value < 0.05 ? "statistically significant" : "not statistically significant";
          
          insights.push(
            `ANOVA results: F = ${f_statistic?.toFixed(2) || 'N/A'}, p = ${p_value?.toFixed(4) || 'N/A'} ` +
            `(${significance} difference between groups at α = 0.05).`
          );
        }
        break;

      case "categorical-categorical":
        if (statistical_tests?.chi_square) {
          const { statistic, p_value } = statistical_tests.chi_square;
          const significance = p_value < 0.05 ? "statistically significant" : "not statistically significant";
          
          insights.push(
            `Chi-square test: χ² = ${statistic?.toFixed(2) || 'N/A'}, p = ${p_value?.toFixed(4) || 'N/A'} ` +
            `(${significance} association between variables at α = 0.05).`
          );
        }
        break;

      default:
        insights.push("Analyzing relationship between variables...");
    }

    // Model performance insights if available
    if (model_performance && Object.keys(model_performance).length > 0) {
      insights.push("Model Performance:");
      
      if (model_performance.r2 !== undefined) {
        insights.push(`- R² (variance explained): ${model_performance.r2.toFixed(3)}`);
      }
      if (model_performance.rmse !== undefined) {
        insights.push(`- RMSE: ${model_performance.rmse.toFixed(3)}`);
      }
      if (model_performance.mae !== undefined) {
        insights.push(`- MAE: ${model_performance.mae.toFixed(3)}`);
      }
    }

    // Data quality insights
    if (plot_data?.y) {
      const yValues = plot_data.y || [];
      const missingCount = yValues.filter(x => x === null || x === undefined).length;
      const zeroCount = yValues.filter(x => x === 0).length;
      
      if (missingCount > 0) {
        insights.push(`Data Quality: ${missingCount} missing values detected.`);
      }
      if (zeroCount > yValues.length * 0.5) {
        insights.push(`Note: High proportion of zero values (${zeroCount} zeros).`);
      }
    }

    // Add recommendations if we have any insights
    if (insights.length > 0) {
      insights.push("Recommendations:");
      
      if (relationship_type === "numeric-numeric" && correlation !== null) {
        if (Math.abs(correlation) > 0.7) {
          insights.push("- Strong correlation suggests predictive modeling potential");
        } else if (Math.abs(correlation) < 0.3) {
          insights.push("- Weak correlation - consider exploring other relationships");
        }
      }
      
      if (outlierCount > 0) {
        insights.push("- Investigate outliers for data quality or special cases");
      }
      
      if (model_performance?.r2 < 0.6) {
        insights.push("- Model might benefit from feature engineering or tuning");
      }
    }

    return insights;
  };

  const insightsList = generateInsights();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 mt-4 relative">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Show jargon definitions"
        >
          <svg
            className="w-5 h-5 mr-2 text-blue-500 hover:text-white transition-all hover:bg-blue-500 rounded-full"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          
        </button>
          Data Insights
        </h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Show jargon definitions"
        >
          
        </button>
      </div>

      {insightsList.length > 0 ? (
        <ul className="space-y-2">
          {insightsList.map((insight, index) => (
            <li key={index} className="text-sm text-gray-700 flex items-start">
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500 text-sm flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          No insights available from the current analysis.
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
        <p>Insights generated at {new Date().toLocaleString()}</p>
      </div>

      <JargonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};