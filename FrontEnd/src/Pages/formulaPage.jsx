

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GraphSidebar from "../Components/SidebarForGraph";
import TableSidebar from "../Components/SidebarForTable";
import CsvTable from "../Components/CsvTable";
import { FaChartLine, FaTrash } from "react-icons/fa";
import Calculator from "../Components/FormulaPage/CalculatorButtons";
import * as math from 'mathjs'; // Math library for safe expression evaluation

const FormulaPage = () => {
  // Router hooks for navigation and accessing location state
  const location = useLocation();
  const navigate = useNavigate();
  
  // Destructure data passed via router state with default values
  const { 
    csvData = [],       // Array of CSV data rows
    columns = [],       // Array of column names
    file,               // File information
    preserveCharts = [],// Saved chart configurations
    currentSelections = {} // Current user selections
  } = location.state || {};

  // State management for all component data
  const [selectedColumn, setSelectedColumn] = useState(""); // Currently selected column
  const [calculationType, setCalculationType] = useState("sum"); // Type of calculation
  const [result, setResult] = useState(null); // Calculation result
  const [savedVariables, setSavedVariables] = useState([]); // Saved variables array
  const [variableName, setVariableName] = useState(""); // Current variable name input
  const [error, setError] = useState(null); // Error message
  const [calculatorInput, setCalculatorInput] = useState(""); // Calculator input string
  const [filteredData, setFilteredData] = useState(csvData); // Filtered CSV data
  const [savedCalculations, setSavedCalculations] = useState([]); // Calculation history

  // Main calculation function for statistics
  const calculateStatistic = () => {
    if (!selectedColumn) {
      setError("Please select a column first");
      return;
    }
  
    try {
      // Extract and parse numeric values from selected column
      const values = filteredData
        .map(row => parseFloat(row[selectedColumn]))
        .filter(value => !isNaN(value));
  
      if (values.length === 0) {
        throw new Error("Selected column contains no valid numbers");
      }
  
      let calculatedValue;
      
      // Perform different calculations based on selected type
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
  
      // Store result and clear any errors
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

  // Handler for when filtered data changes
  const handleFilterChange = (filteredData) => {
    setFilteredData(filteredData);
  };

  // Save current result as a named variable
  const saveVariable = () => {
    if (!variableName.trim()) {
      setError("Please enter a variable name");
      return;
    }
  
    if (result === null || result.type !== calculationType) {
      setError("No valid result to save. Calculate first.");
      return;
    }
  
    // Add new variable to savedVariables array
    setSavedVariables(prev => [
      ...prev,
      {
        name: variableName,
        value: result.value,
        column: selectedColumn,
        type: calculationType
      }
    ]);
  
    // Reset input field and clear errors
    setVariableName("");
    setError(null);
  };

  // Save current calculator expression to history
  const saveCalculation = () => {
    if (!calculatorInput.trim()) {
      setError("Please enter a calculation first");
      return;
    }

    try {
      // Create evaluation scope with saved variables
      const scope = {};
      savedVariables.forEach(variable => {
        scope[variable.name] = variable.value;
      });

      // Check for undefined variables in expression
      const expressionVars = calculatorInput.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
      const undefinedVars = expressionVars.filter(varName => 
        !savedVariables.some(v => v.name === varName) &&
        !math[varName] // Exclude math.js functions
      );

      if (undefinedVars.length > 0) {
        throw new Error(`Undefined variables: ${undefinedVars.join(', ')}. Save them first.`);
      }

      // Evaluate the expression using math.js
      const calculationResult = math.evaluate(calculatorInput, scope);
      
      // Add calculation to history (newest first)
      setSavedCalculations(prev => [
        {
          formula: calculatorInput,
          result: calculationResult,
          timestamp: new Date().toLocaleString()
        },
        ...prev
      ]);
      
      setError(null);
    } catch (err) {
      setError("Calculation error: " + err.message);
    }
  };

  // Navigation handlers
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

  // Delete handlers
  const deleteVariable = (indexToDelete) => {
    setSavedVariables(prev => prev.filter((_, index) => index !== indexToDelete));
  };

  const deleteCalculation = (indexToDelete) => {
    setSavedCalculations(prev => prev.filter((_, index) => index !== indexToDelete));
  };

  // Helper to get display label for calculation type
  const getResultLabel = () => {
    switch (calculationType) {
      case "sum": return "Sum";
      case "mean": return "Mean";
      case "median": return "Median";
      case "mode": return "Mode";
      default: return "Result";
    }
  };

  const infoText = "Avoid using spaces or special characters in the variable name. Only underscore ( _ ) is allowed.";
  
  // Main component render
  return (
    <section className="bg-displayBg bg-no-repeat bg-cover bg-bottom w-full min-h-screen flex flex-col items-center">
      {/* Sidebar layout */}
      <div className="flex w-full">
        <TableSidebar />
        <GraphSidebar />
      </div>

      {/* Logo display */}
      <div className="m-10 w-48 h-12 bg-logo bg-no-repeat bg-cover bg-center"></div>

      {/* Main control panel */}
      <div className="w-2/3 flex justify-between items-center p-2 text-white font-inter">
        <div className="flex flex-col space-y-6 w-3/4">
          {/* Column selection and calculation type row */}
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

          {/* Results display area */}
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
            
            {/* Variable saving interface */}
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
              <p className="text-xs text-gray-400 mb-2 text-left mr-28">
                {infoText}
              </p>
          </div>
        )}
        </div>

        {/* Navigation buttons */}
        <div className="flex flex-col w-1/4 self-end">
          <button 
            className="w-36 h-12 mx-10 mb-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center gap-2"
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

      {/* Error display */}
      {error && (
        <div className="w-10/12 bg-red-900/90 text-white p-3 rounded-lg mb-3 flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {/* Data table display */}
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

      {/* Saved variables display */}
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

      {/* Calculator component */}
      <Calculator 
        input={calculatorInput} 
        setInput={setCalculatorInput}
        savedVariables={savedVariables}
      />

      {/* Calculation history section */}
      <div className="w-10/12 flex flex-col items-end my-4">
        <button
          className="p-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300 mb-3"
          onClick={saveCalculation}
        >
          SAVE CALCULATION
        </button>
        
        {/* Calculation history list */}
        {savedCalculations.length > 0 && (
          <div className="w-full bg-gray-800/90 p-4 rounded-lg border border-gray-700">
            <h3 className="text-white text-lg font-bold mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Calculation History
            </h3>
            <div className="space-y-3">
              {savedCalculations.map((calculation, index) => (
                <div 
                  key={index} 
                  className="bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700 transition flex justify-between items-start"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-yellow-400 truncate font-mono text-sm sm:text-base">
                      {calculation.formula}
                    </p>
                    <p className="text-white font-mono mt-1 text-sm sm:text-base">
                      = {typeof calculation.result === 'number' 
                          ? calculation.result.toLocaleString(undefined, {
                              maximumFractionDigits: 2
                            })
                          : calculation.result}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {calculation.timestamp}
                    </p>
                  </div>
                  <button
                    className="text-red-400 hover:text-red-300 ml-3 p-1"
                    onClick={() => deleteCalculation(index)}
                    title="Delete calculation"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FormulaPage;