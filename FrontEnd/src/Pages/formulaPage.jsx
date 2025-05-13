import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GraphSidebar from "../Components/SidebarForGraph";
import TableSidebar from "../Components/SidebarForTable";
import CsvTable from "../Components/CsvTable";
import { FaChartLine, FaTrash } from "react-icons/fa";
import Calculator from "../Components/FormulaPage/CalculatorButtons";

const FormulaPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Attempt to load full state from location.state, falling back to localStorage
  const savedState =
    JSON.parse(localStorage.getItem("formulaPageState")) || {};
  const incoming = location.state || savedState;

  const initialCsvData = incoming.csvData || [];
  const initialColumns = incoming.columns || [];
  const initialFile = incoming.file || null;
  const initialPreserveCharts = incoming.preserveCharts || [];
  const initialSelections = incoming.currentSelections || {};
  const initialFiltered =
    incoming.filteredData !== undefined
      ? incoming.filteredData
      : initialCsvData;
  const initialVariables = incoming.savedVariables || [];

  // 2. Set up React state with those initials
  const [csvData] = useState(initialCsvData); // never mutates
  const [columns, setColumns] = useState(initialColumns);
  const [file] = useState(initialFile);
  const [preserveCharts] = useState(initialPreserveCharts);
  const [currentSelections] = useState(initialSelections);
  const [filteredData, setFilteredData] = useState(initialFiltered);
  const [savedVariables, setSavedVariables] =
    useState(initialVariables);

  const [selectedColumn, setSelectedColumn] = useState("");
  const [calculationType, setCalculationType] = useState("sum");
  const [result, setResult] = useState(null);
  const [variableName, setVariableName] = useState("");
  const [calculatorInput, setCalculatorInput] = useState("");
  const [error, setError] = useState(null);

  // 3. Persist *all* relevant state back to localStorage on change
  useEffect(() => {
    const toSave = {
      csvData,
      columns,
      file, // note: File object won't fully survive JSON, but Display can rebuild from csvData
      preserveCharts,
      currentSelections,
      filteredData,
      savedVariables,
    };
    localStorage.setItem("formulaPageState", JSON.stringify(toSave));
  }, [
    csvData,
    columns,
    file,
    preserveCharts,
    currentSelections,
    filteredData,
    savedVariables,
  ]);

  // 4. Only update filteredData when CsvTable actually filters
  const handleFilterChange = useCallback((newFiltered) => {
    setFilteredData(prev =>
      JSON.stringify(prev) !== JSON.stringify(newFiltered)
        ? newFiltered
        : prev
    );
  }, []);

  // 5. Your calculation logic (unchanged)
  const calculateStatistic = () => {
    if (!selectedColumn) {
      setError("Please select a column first");
      return;
    }
    try {
      const vals = filteredData
        .map(r => parseFloat(r[selectedColumn]))
        .filter(v => !isNaN(v));
      if (vals.length === 0)
        throw new Error("Selected column contains no valid numbers");

      let calc;
      switch (calculationType) {
        case "sum":
          calc = vals.reduce((a, b) => a + b, 0);
          break;
        case "mean":
          calc = vals.reduce((a, b) => a + b, 0) / vals.length;
          break;
        case "median":
          vals.sort((a, b) => a - b);
          const m = Math.floor(vals.length / 2);
          calc =
            vals.length % 2
              ? vals[m]
              : (vals[m - 1] + vals[m]) / 2;
          break;
        case "mode":
          const freq = {};
          vals.forEach(v => (freq[v] = (freq[v] || 0) + 1));
          let maxF = 0,
            modes = [];
          for (const v in freq) {
            if (freq[v] > maxF) {
              maxF = freq[v];
              modes = [Number(v)];
            } else if (freq[v] === maxF) {
              modes.push(Number(v));
            }
          }
          calc = modes.length === 1 ? modes[0] : modes;
          break;
        default:
          throw new Error("Invalid calculation type");
      }
      setResult({ value: calc, type: calculationType });
      setError(null);
    } catch (e) {
      setError(e.message);
      setResult(null);
    }
  };

  // 6. Save a variable
  const saveVariable = () => {
    if (!variableName.trim()) {
      setError("Please enter a variable name");
      return;
    }
    if (!result) {
      setError("No valid result to save. Calculate first.");
      return;
    }
    setSavedVariables(prev => [
      ...prev,
      {
        name: variableName,
        value: result.value,
        column: selectedColumn,
        type: calculationType,
      },
    ]);
    setVariableName("");
    setError(null);
  };

  // 7. Navigation handlers
  const handleUploadAnother = () => {
    navigate("/upload-page", {
      state: {
        preserveVariables: savedVariables,
        preserveCharts,
      },
    });
  };
  const handleBackToDisplay = () => {
    navigate("/Display-Page", {
      state: {
        csvData,
        columns,
        file,
        preserveCharts,
        preserveVariables: savedVariables,
        currentSelections,
      },
    });
  };

  const deleteVariable = idx =>
    setSavedVariables(prev => prev.filter((_, i) => i !== idx));

  const getResultLabel = () => ({
    sum: "Sum",
    mean: "Mean",
    median: "Median",
    mode: "Mode",
  }[calculationType]);

  const infoText =
    "Avoid spaces or special characters in variable names—use underscore only.";

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
      <div className="w-2/3 flex justify-between items-center p-2 text-white font-inter">
        {/* Column + type + calculate */}
        <div className="flex flex-col space-y-6 w-3/4">
          <div className="grid grid-cols-3 gap-4">
            <select
              className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400"
              value={selectedColumn}
              onChange={e => setSelectedColumn(e.target.value)}
            >
              <option value="">Select Column</option>
              {columns.map((col, i) => (
                <option key={i} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <select
              className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400"
              value={calculationType}
              onChange={e => setCalculationType(e.target.value)}
            >
              <option value="sum">Sum</option>
              <option value="mean">Mean</option>
              <option value="median">Median</option>
              <option value="mode">Mode</option>
            </select>
            <button
              className="w-full p-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition duration-300"
              onClick={calculateStatistic}
            >
              CALCULATE
            </button>
          </div>

          {/* Result + save variable */}
          {result && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-3 rounded border border-gray-500">
                <p className="text-yellow-400">
                  {getResultLabel()} of {selectedColumn}:
                </p>
                <p className="text-2xl font-bold">
                  {Array.isArray(result.value)
                    ? result.value.join(", ")
                    : result.value}
                </p>
                <p className="text-sm text-gray-400">
                  (Based on {filteredData.length} filtered rows)
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400"
                  placeholder="Variable name"
                  value={variableName}
                  onChange={e => setVariableName(e.target.value)}
                />
                <button
                  className="p-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300"
                  onClick={saveVariable}
                >
                  SAVE
                </button>
              </div>
              <p className="text-xs text-gray-400 mb-2 col-span-2">
                {infoText}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col w-1/4 self-end">
          <button
            className="w-36 h-12 mx-10 mb-3 p-3 bg-cyan-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center gap-2"
            onClick={handleBackToDisplay}
          >
            <FaChartLine /> BACK TO DISPLAY
          </button>
          <button
            className="w-36 h-24 mx-10 mb-5 text-xl bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition duration-300"
            onClick={handleUploadAnother}
          >
            UPLOAD <br /> ANOTHER <br /> CSV
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="w-10/12 bg-red-900 text-white p-2 rounded-lg mb-4">
          Error: {error}
        </div>
      )}

      {/* Table */}
      <div className="w-10/12 flex justify-center my-10">
        {csvData.length ? (
          <CsvTable
            columns={columns}
            csvData={csvData}
            onFilterChange={handleFilterChange}
          />
        ) : (
          <p className="text-white text-lg">No CSV data available.</p>
        )}
      </div>

      {/* Saved Variables */}
      {savedVariables.length > 0 && (
        <div className="w-10/12 bg-gray-800 p-6 rounded-lg mb-10">
          <h3 className="text-white text-xl font-bold mb-4">
            Saved Variables
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {savedVariables.map((v, i) => (
              <div
                key={i}
                className="bg-gray-700 p-3 rounded border border-gray-600 hover:bg-gray-600 transition relative group"
              >
                <button
                  className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => deleteVariable(i)}
                  title="Delete variable"
                >
                  <FaTrash />
                </button>
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    setCalculatorInput(prev => prev + v.name)
                  }
                >
                  <p className="text-yellow-400 font-bold">{v.name}</p>
                  <p className="text-white">
                    {v.type}:{" "}
                    {Array.isArray(v.value)
                      ? v.value.join(", ")
                      : v.value}
                  </p>
                  <p className="text-gray-400 text-sm">
                    From column: {v.column}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calculator */}
      <Calculator
        input={calculatorInput}
        setInput={setCalculatorInput}
        savedVariables={savedVariables}
      />
    </section>
  );
};

export default FormulaPage;
