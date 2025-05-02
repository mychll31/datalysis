import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GraphSidebar from "../Components/SidebarForGraph";
import TableSidebar from "../Components/SidebarForTable";
import CsvTable from "../Components/CsvTable";
import { FaChartLine, FaTrash } from "react-icons/fa";
import Calculator from "../Components/FormulaPage/CalculatorButtons";

const FormulaPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    csvData = [], 
    columns = [], 
    file, 
    preserveCharts = [],
    currentSelections = {}
  } = location.state || {};
  
  const [selectedColumn, setSelectedColumn] = useState("");
  const [calculationType, setCalculationType] = useState("sum");
  const [result, setResult] = useState(null);
  const [savedVariables, setSavedVariables] = useState([]);
  const [variableName, setVariableName] = useState("");
  const [error, setError] = useState(null);
  const [calculatorInput, setCalculatorInput] = useState("");
  const [filteredData, setFilteredData] = useState(csvData);

  // Memoized filter change handler to prevent infinite loops
  const handleFilterChange = useCallback((newFilteredData) => {
    setFilteredData(prev => {
      // Deep comparison to prevent unnecessary updates
      if (JSON.stringify(prev) !== JSON.stringify(newFilteredData)) {
        return newFilteredData;
      }
      return prev;
    });
  }, []);

  const calculateStatistic = () => {
    if (!selectedColumn) {
      setError("Please select a column first");
      return;
    }
  
    try {
      const values = filteredData
        .map(row => parseFloat(row[selectedColumn]))
        .filter(value => !isNaN(value));
  
      if (values.length === 0) {
        throw new Error("Selected column contains no valid numbers");
      }
  
      let calculatedValue;
      
      switch (calculationType) {
        case "sum":
          calculatedValue = values.reduce((acc, val) => acc + val, 0);
          break;
          
        case "mean":
          calculatedValue = values.reduce((acc, val) => acc + val, 0) / values.length;
          break;
          
        case "median":
          values.sort((a, b) => a - b);
          const mid = Math.floor(values.length / 2);
          calculatedValue = values.length % 2 !== 0 
            ? values[mid] 
            : (values[mid - 1] + values[mid]) / 2;
          break;
          
        case "mode":
          const frequency = {};
          values.forEach(value => {
            frequency[value] = (frequency[value] || 0) + 1;
          });
          
          let maxFrequency = 0;
          let modes = [];
          
          for (const value in frequency) {
            if (frequency[value] > maxFrequency) {
              modes = [Number(value)];
              maxFrequency = frequency[value];
            } else if (frequency[value] === maxFrequency) {
              modes.push(Number(value));
            }
          }
          
          calculatedValue = modes.length === 1 ? modes[0] : modes;
          break;
          
        default:
          throw new Error("Invalid calculation type");
      }
  
      setResult({
        value: calculatedValue,
        type: calculationType
      });
      setError(null);
    } catch (error) {
      setError(error.message);
      setResult(null);
    }
  };

  const saveVariable = () => {
    if (!variableName.trim()) {
      setError("Please enter a variable name");
      return;
    }
  
    if (result === null || result.type !== calculationType) {
      setError("No valid result to save. Calculate first.");
      return;
    }
  
    setSavedVariables(prev => [
      ...prev,
      {
        name: variableName,
        value: result.value,
        column: selectedColumn,
        type: calculationType
      }
    ]);
  
    setVariableName("");
    setError(null);
  };

  const handleUploadAnother = () => {
    navigate('/upload-page', { 
      state: { 
        preserveVariables: savedVariables,
        preserveCharts 
      } 
    });
  };

  const handleBackToDisplay = () => {
    navigate('/Display-Page', { 
      state: { 
        csvData, 
        columns,
        file,
        preserveCharts,
        preserveVariables: savedVariables,
        currentSelections
      } 
    });
  };

  const deleteVariable = (indexToDelete) => {
    setSavedVariables(prev => prev.filter((_, index) => index !== indexToDelete));
  };

  const getResultLabel = () => {
    switch (calculationType) {
      case "sum": return "Sum";
      case "mean": return "Mean";
      case "median": return "Median";
      case "mode": return "Mode";
      default: return "Result";
    }
  };

  const infoText = `
  Avoid using spaces or special characters in the variable name. Only underscore ( _ ) is allowed.
  `;

  return (
    <section className="bg-displayBg bg-no-repeat bg-cover bg-bottom w-full min-h-screen flex flex-col items-center">
      <div className="flex w-full">
        <TableSidebar />
        <GraphSidebar />
      </div>

      <div className="m-10 w-48 h-12 bg-logo bg-no-repeat bg-cover bg-center"></div>

      <div className="w-2/3 flex justify-between items-center p-2 text-white font-inter">
        <div className="flex flex-col space-y-6 w-3/4">
          <div className="grid grid-cols-3 gap-4">
            <select
              className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400"
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
            >
              <option value="">Select Column</option>
              {columns.map((col, index) => (
                <option key={index} value={col}>{col}</option>
              ))}
            </select>
            
            <select
              className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400"
              value={calculationType}
              onChange={(e) => setCalculationType(e.target.value)}
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

          {result !== null && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-3 rounded border border-gray-500">
              <p className="text-yellow-400">{getResultLabel()} of {selectedColumn}:</p>
              <p className="text-2xl font-bold">
                {result.type === calculationType 
                  ? (Array.isArray(result.value) ? result.value.join(", ") : result.value)
                  : "Press CALCULATE to update"}
              </p>
              {result.type === calculationType && Array.isArray(result.value) && result.value.length > 1 && (
                <p className="text-sm text-gray-400">(Multiple modes found)</p>
              )}
              <p className="text-sm text-gray-400">(Based on {filteredData.length} filtered rows)</p>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400"
                placeholder="Variable name"
                value={variableName}
                onChange={(e) => setVariableName(e.target.value)}
              />
              <button
                className="p-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300"
                onClick={saveVariable}
              >
                SAVE
              </button>
            </div>
              <p className="text-xs text-gray-400 mb-2 text-left mr-28"></p>
              <p className="text-xs text-gray-400 mb-2 text-left mr-28">
                {infoText}
              </p>
          </div>
        )}
        </div>

        <div className="flex flex-col w-1/4 self-end">
          <button 
            className="w-36 h-12 mx-10 mb-3 p-3 font-bold rounded-lg bg-gray-800 hover:bg-cyan-900 text-yellow-400 transition duration-300 flex items-center justify-center gap-2"
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

      {error && (
        <div className="w-10/12 bg-red-900 text-white p-2 rounded-lg ">
          Error: {error}
        </div>
      )}
      
      <div className="w-10/12 flex justify-center my-10">
        {csvData.length > 0 ? (
          <CsvTable 
            columns={columns} 
            csvData={csvData} 
            onFilterChange={handleFilterChange} 
          />
        ) : (
          <p className="text-white text-lg">No CSV data available.</p>
        )}
      </div>

      {savedVariables.length > 0 && (
        <div className="w-10/12 bg-gray-800 p-6 rounded-lg mb-10">
          <h3 className="text-white text-xl font-bold mb-4">Saved Variables</h3>
          <div className="grid grid-cols-3 gap-4">
            {savedVariables.map((variable, index) => (
              <div
                key={index}
                className="bg-gray-700 p-3 rounded border border-gray-600 hover:bg-gray-600 transition relative group"
              >
                <button
                  className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteVariable(index);
                  }}
                  title="Delete variable"
                >
                  <FaTrash />
                </button>
                
                <div 
                  className="cursor-pointer"
                  onClick={() => setCalculatorInput(prev => prev + variable.name)}
                >
                  <p className="text-yellow-400 font-bold">{variable.name}</p>
                  <p className="text-white">
                    {variable.type}: {Array.isArray(variable.value) 
                      ? variable.value.join(", ") 
                      : variable.value}
                  </p>
                  <p className="text-gray-400 text-sm">From column: {variable.column}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Calculator 
        input={calculatorInput} 
        setInput={setCalculatorInput}
        savedVariables={savedVariables}
      />
    </section>
  );
};

export default FormulaPage;