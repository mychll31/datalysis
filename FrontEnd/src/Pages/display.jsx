import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GraphSidebar from "../Components/SidebarForGraph";
import TableSidebar from "../Components/SidebarForTable";
import CsvTable from "../Components/CsvTable";
import { PieChart } from "../Components/Pie"; 
import StatisticsSummary from "../Components/StatisticSum";
import { RelationshipChart } from "../Components/RelationshipChart";
import { RelationshipData } from "../Components/FAKE_DATA";
import { InsightComponent } from "../Components/Insights";
import { FaCalculator } from "react-icons/fa";
import { handleGeneratePDF } from "../Components/Pdfgenerate";

const API_BASE_URL = "https://datalysis.onrender.com";
console.log("ALL ENV:", import.meta.env);
console.log("API base URL:", API_BASE_URL)

const Display = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ── 1. Initialize from location.state OR localStorage ────────────────────────
  const [csvData, setCsvData] = useState(() => {
    if (location.state?.csvData) {
      return location.state.csvData;
    }
    const stored = localStorage.getItem("csvData");
    return stored ? JSON.parse(stored) : [];
  });

  const [columns, setColumns] = useState(() => {
    if (location.state?.columns) {
      return location.state.columns;
    }
    const stored = localStorage.getItem("columns");
    return stored ? JSON.parse(stored) : [];
  });

  const [file, setFile] = useState(() => {
    return location.state?.file || null;
  });

  const [companyName, setCompanyName] = useState(() => {
    if (location.state?.companyName) {
      return location.state.companyName;
    }
    return localStorage.getItem("companyName") || "";
  });

  // ── 2. Persist back into localStorage whenever these change ────────────────────
  useEffect(() => {
    localStorage.setItem("csvData", JSON.stringify(csvData));
  }, [csvData]);

  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem("companyName", companyName);
  }, [companyName]);

  // ── Rest of your original state and refs ──────────────────────────────────────
  const [targetColumn1, setTargetColumn1] = useState("");
  const [targetColumn2, setTargetColumn2] = useState("");
  const [outputType, setOutputType] = useState("relationship");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [charts, setCharts] = useState([]);
  const [currentChartIndex, setCurrentChartIndex] = useState(null);
  const chartRefs = useRef([]);

  // ── Navigation handlers ───────────────────────────────────────────────────────
  const handleUploadAnother = () => {
    navigate("/upload-page", { state: { preserveCharts: charts } });
  };

  const handleFormulaPage = () => {
    navigate("/Formula-Page", {
      state: {
        csvData,
        columns,
        file,
        preserveCharts: charts,
        currentSelections: {
          targetColumn1,
          targetColumn2,
          outputType,
        },
      },
    });
  };

  // ── Apply / API call handler ──────────────────────────────────────────────────
  const handleApply = async () => {
    if (outputType === "pie") {
      if (!targetColumn1) {
        setError("Please select a target column");
        return;
      }
    } else {
      if (!targetColumn1 || !targetColumn2) {
        setError("Please select both target columns");
        return;
      }
    }

    setError(null);
    setSuccess(null);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("target_column1", targetColumn1);
      if (outputType !== "pie") {
        formData.append("target_column2", targetColumn2);
      }
      formData.append("output_type", outputType);

      if (file) {
        formData.append("file", file);
      } else {
        const headers = columns.join(",");
        const rows = csvData.map((row) =>
          columns.map((col) => JSON.stringify(row[col])).join(",")
        );
        const csvContent = [headers, ...rows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        formData.append("file", blob, "data.csv");
      }

      const response = await fetch(`${API_BASE_URL}/upload-csv/`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Unexpected response: ${text.substring(0, 100)}`);
      }

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || `Server error: ${response.status}`);
      }

      if (
        outputType === "relationship" &&
        result.column_stats &&
        result.column_stats[targetColumn1]?.type === "categorical" &&
        result.column_stats[targetColumn2]?.type === "categorical"
      ) {
        throw new Error(
          "Both selected columns cannot be categorical. Please choose at least one numeric column for relationship analysis."
        );
      }

      setSuccess("Analysis completed successfully!");

      if (currentChartIndex !== null) {
        setCharts((prev) =>
          prev.map((chart, idx) =>
            idx === currentChartIndex
              ? {
                  type: outputType,
                  data: result,
                  targetColumn1,
                  targetColumn2,
                }
              : chart
          )
        );
        setCurrentChartIndex(null);
      } else {
        setCharts((prev) => [
          ...prev,
          { type: outputType, data: result, targetColumn1, targetColumn2 },
        ]);
      }
    } catch (err) {
      console.error("Full error:", err);
      setError(err.message || "Analysis failed. Check console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  const preparePieChartData = (plotData) => {
    if (!plotData) return null;
    return {
      plot_data: {
        labels: plotData.labels || [],
        values: plotData.values || [],
      },
    };
  };

  const handleEditChart = (index) => {
    if (currentChartIndex === index) {
      setCurrentChartIndex(null);
      setTargetColumn1("");
      setTargetColumn2("");
      setOutputType("relationship");
    } else {
      const chart = charts[index];
      setTargetColumn1(chart.targetColumn1);
      setTargetColumn2(chart.targetColumn2 || "");
      setOutputType(chart.type);
      setCurrentChartIndex(index);
    }
  };

  const handleDeleteChart = (index) => {
    setCharts((prev) => prev.filter((_, i) => i !== index));
    if (currentChartIndex === index) {
      setCurrentChartIndex(null);
    } else if (currentChartIndex > index) {
      setCurrentChartIndex((prev) => prev - 1);
    }
  };

  return (
    <section className="bg-displayBg bg-no-repeat bg-cover bg-bottom w-full min-h-screen flex flex-col items-center">
      {/* Sidebars */}
      <div className="flex w-full">
        <TableSidebar />
        <GraphSidebar />
      </div>

      {/* Logo */}
      <div className="m-10 w-48 h-12 bg-logo bg-no-repeat bg-cover bg-center" />

      {/* Controls */}
      <div className="w-2/3 flex justify-between items-center p-6 text-white font-inter">
        {/* Column selectors */}
        <div className="flex flex-col space-y-6 w-3/4">
          <div className="grid grid-cols-2 gap-4">
            <select
              className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400"
              value={targetColumn1}
              onChange={(e) => setTargetColumn1(e.target.value)}
              required
            >
              <option value="">Select Target Column</option>
              {columns.map((col, idx) => (
                <option key={idx} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <select
              className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400"
              value={outputType}
              onChange={(e) => setOutputType(e.target.value)}
            >
              <option value="relationship">Relationship Chart</option>
              <option value="pie">Pie Chart</option>
            </select>
          </div>

          {outputType !== "pie" && (
            <div className="grid grid-cols-2 gap-4">
              <select
                className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400"
                value={targetColumn2}
                onChange={(e) => setTargetColumn2(e.target.value)}
                required
              >
                <option value="">Select Second Target Column</option>
                {columns.map((col, idx) => (
                  <option key={idx} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col w-1/4 self-end">
          <button
            className="w-36 h-24 mx-10 mb-5 text-xl bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition duration-300"
            onClick={handleUploadAnother}
          >
            UPLOAD <br /> ANOTHER <br /> CSV
          </button>
          <button
            className="w-36 h-12 mx-10 mb-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition duration-300"
            onClick={handleApply}
            disabled={isProcessing}
          >
            {isProcessing
              ? "PROCESSING..."
              : currentChartIndex !== null
              ? "UPDATE CHART"
              : "ANALYZE"}
          </button>
          <button
            className="w-36 p-3 h-12 mx-10 mb-3 font-bold rounded-lg bg-gray-800 hover:bg-cyan-900 text-yellow-400 transition duration-300 flex items-center justify-center gap-2"
            onClick={handleFormulaPage}
          >
            <FaCalculator /> FORMULA PAGE
          </button>
          {error && (
            <div className="mx-10 text-red-500 text-sm mb-2">Error: {error}</div>
          )}
          {success && (
            <div className="mx-10 text-green-500 text-sm">{success}</div>
          )}
        </div>
      </div>

      {/* CSV Table */}
      <div className="w-10/12 flex justify-center my-10">
        {csvData.length > 0 ? (
          <CsvTable columns={columns} csvData={csvData} />
        ) : (
          <p className="text-white text-lg">No CSV data available.</p>
        )}
      </div>

      {/* Charts */}
      <div className="w-10/12 mb-10">
        {charts.map((chart, index) => (
          <div
            key={index}
            ref={(el) => (chartRefs.current[index] = el)}
            className="mb-10 relative group"
          >
            {/* Edit / Delete controls */}
            <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={() => handleEditChart(index)}
                className={`p-1 rounded ${
                  currentChartIndex === index ? "bg-green-500" : "bg-blue-500"
                } text-white`}
                title="Toggle edit mode for this chart"
              >
                {/* icon omitted for brevity */}
                ✎
              </button>
              <button
                onClick={() => handleDeleteChart(index)}
                className="bg-red-500 text-white p-1 rounded"
                title="Delete this chart"
              >
                🗑
              </button>
            </div>

            {/* Render Pie or Relationship */}
            {chart.type === "pie" && chart.data?.plot_data && (
              <div className="App bg-white border-gray-900 border-8 shadow-xl rounded-lg">
                <PieChart
                  data={preparePieChartData(chart.data.plot_data)}
                  title={`Distribution of ${chart.targetColumn1}`}
                />
              </div>
            )}

            {chart.type === "relationship" && (
              <>
                {chart.data?.column_stats &&
                chart.data.column_stats[chart.targetColumn1]?.type ===
                  "categorical" &&
                chart.data.column_stats[chart.targetColumn2]?.type ===
                  "categorical" ? (
                  <div className="text-red-500 text-center my-4">
                    Error: Both selected columns cannot be categorical.
                  </div>
                ) : (
                  <div className="App bg-white border-gray-900 border-8 shadow-xl flex flex-row">
                    <RelationshipChart data={chart.data || RelationshipData} />
                    <InsightComponent data={chart.data || RelationshipData} />
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Generate PDF */}
      <button
        className="w-36 h-24 mx-10 mb-5 text-xl bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition duration-300"
        onClick={() => {
          const validChartRefs = chartRefs.current.filter(
            (ref) => ref && document.body.contains(ref)
          );
          if (validChartRefs.length > 0) {
            handleGeneratePDF(validChartRefs, companyName, {
              fileName: file?.name || "data.csv",
              rowCount: csvData.length,
              columnCount: columns.length,
              columnNames: columns,
            });
          } else {
            alert("No valid charts available for PDF generation");
          }
        }}
      >
        Generate PDF
      </button>
    </section>
  );
};

export default Display;
