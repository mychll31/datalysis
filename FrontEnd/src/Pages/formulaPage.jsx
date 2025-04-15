import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GraphSidebar from "../Components/SidebarForGraph";
import TableSidebar from "../Components/SidebarForTable";
import CsvTable from "../Components/CsvTable";
import { FaChartLine } from "react-icons/fa";
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
  const [sumResult, setSumResult] = useState(null);
  const [savedVariables, setSavedVariables] = useState([]);
  const [variableName, setVariableName] = useState("");
  const [error, setError] = useState(null);
  const [calculatorInput, setCalculatorInput] = useState("");
  const [filteredData, setFilteredData] = useState(csvData); // State to hold filtered data

  const calculateSum = () => {
    if (!selectedColumn) {
      setError("Please select a column first");
      return;
    }

    try {
      let sum = 0;
      let validNumbers = 0;
      
      // Use filteredData instead of csvData for the calculation
      filteredData.forEach(row => {
        const value = parseFloat(row[selectedColumn]);
        if (!isNaN(value)) {
          sum += value;
          validNumbers++;
        }
      });

      if (validNumbers === 0) {
        throw new Error("Selected column contains no valid numbers");
      }

      setSumResult(sum);
      setError(null);
    } catch (error) {
      setError(error.message);
      setSumResult(null);
    }
  };

  // Function to update filtered data from CsvTable
  const handleFilterChange = (filteredData) => {
    setFilteredData(filteredData);
  };

  const saveVariable = () => {
    if (!variableName.trim()) {
      setError("Please enter a variable name");
      return;
    }

    if (sumResult === null) {
      setError("No sum result to save. Calculate sum first.");
      return;
    }

    setSavedVariables(prev => [
      ...prev,
      {
        name: variableName,
        value: sumResult,
        column: selectedColumn
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

  return (
    <section className="bg-displayBg bg-no-repeat bg-cover bg-bottom w-full min-h-screen flex flex-col items-center">
      <div className="flex w-full">
        <TableSidebar />
        <GraphSidebar />
      </div>

      <div className="m-10 w-48 h-12 bg-logo bg-no-repeat bg-cover bg-center"></div>

      <div className="w-2/3 flex justify-between items-center p-6 text-white font-inter">
        <div className="flex flex-col space-y-6 w-3/4">
          <div className="grid grid-cols-2 gap-4">
            <select
              className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400"
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
            >
              <option value="">Select Column to Sum</option>
              {columns.map((col, index) => (
                <option key={index} value={col}>{col}</option>
              ))}
            </select>
            
            <button
              className="w-full p-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition duration-300"
              onClick={calculateSum}
            >
              CALCULATE SUM
            </button>
          </div>

          {sumResult !== null && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-3 rounded border border-gray-500">
                <p className="text-yellow-400">Sum of {selectedColumn}:</p>
                <p className="text-2xl font-bold">{sumResult}</p>
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
            </div>
          )}
        </div>

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
                className="bg-gray-700 p-3 rounded border border-gray-600 cursor-pointer hover:bg-gray-600 transition"
                onClick={() => setCalculatorInput(prev => prev + variable.name)}
              >
                <p className="text-yellow-400 font-bold">{variable.name}</p>
                <p className="text-white">Value: {variable.value}</p>
                <p className="text-gray-400 text-sm">From column: {variable.column}</p>
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

      {error && (
        <div className="w-10/12 bg-red-900 text-white p-4 rounded-lg mb-10">
          Error: {error}
        </div>
      )}
    </section>
  );
};

export default FormulaPage;