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
  
  // for generating PDF report
  const generateFormulaPDF = async () => {
    console.log("=== STARTING PDF GENERATION ===");
    console.log("Saved Calculations:", savedCalculations);
    console.log("Saved Variables:", savedVariables);
  
    if (savedCalculations.length === 0 && savedVariables.length === 0) {
      setError("No calculations or variables to export");
      return;
    }
  
    try {
      // Create FormData object
      const formData = new FormData();
      
      // Append calculations data
      formData.append('calculations', JSON.stringify(savedCalculations));
      
      // Append variables data
      formData.append('variables', JSON.stringify(savedVariables));
      
      // Append company name (use file name if available)
      formData.append('companyName', file?.name || "Data Analysis");
      
      // Explicitly set chartCount to 0 since we're not sending charts
      formData.append('chartCount', '0');
      
      // Append CSV metadata if available
      if (file) {
        formData.append('fileName', file.name);
        formData.append('fileType', 'CSV');
        formData.append('rowsCount', csvData.length.toString());
        formData.append('columnsCount', columns.length.toString());
        formData.append('dataPointsCount', (csvData.length * columns.length).toString());
        
        if (columns.length > 0) {
          formData.append('columnNames', columns.join(','));
        }
      }
  
      // Debug: Log what we're sending
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      // Send to backend
      const response = await fetch("http://localhost:8000/api/pdf/generate-report/", {
        method: "POST",
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Backend error:", errorData);
        throw new Error(errorData.error || "PDF generation failed");
      }
  
      // Handle the PDF download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const filename = `${file?.name.replace(/\s+/g, '_') || 'calculations'}_report.pdf`;
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
  
      console.log("PDF generated successfully!");
  
    } catch (error) {
      console.error("Error:", error);
      setError("PDF Generation Error: " + error.message);
    }
  };
  // Main component render
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

        <button className="w-36 h-24 
                                mx-10 mb-5 text-xl 
                                bg-yellow-500 text-black 
                                font-bold rounded-lg 
                                hover:bg-yellow-600 transition duration-300"
                                onClick={generateFormulaPDF}
                                disabled={savedCalculations.length === 0}>  
                                {savedCalculations.length > 0 ? (
                                    <>GENERATE<br />PDF</>
                                  ) : (
                                    <>NO<br />CALCULATIONS</>
                                  )}
                                </button>
      </div>
    </section>
  );
};

export default FormulaPage;