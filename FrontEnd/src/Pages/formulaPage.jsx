import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GraphSidebar from "../Components/SidebarForGraph";
import TableSidebar from "../Components/SidebarForTable";
import CsvTable from "../Components/CsvTable";
import { FaChartLine, FaTrash } from "react-icons/fa";
import Calculator from "../Components/FormulaPage/CalculatorButtons";
import * as math from "mathjs";

const FormulaPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1) Load from router state or localStorage
  const savedState = JSON.parse(localStorage.getItem("formulaPageState")) || {};
  const incoming = location.state || savedState;

  const initialCsvData    = incoming.csvData            || [];
  const initialColumns    = incoming.columns            || [];
  const initialFile       = incoming.file               || null;
  const initialCharts     = incoming.preserveCharts     || [];
  const initialSelections = incoming.currentSelections  || {};
  const initialFiltered   = incoming.filteredData !== undefined
                            ? incoming.filteredData
                            : initialCsvData;
  const initialVariables  = incoming.savedVariables      || [];
  const initialHistory    = incoming.savedCalculations   || [];

  // 2) React state (CSV never mutates; filteredData, variables, history do)
  const [csvData]          = useState(initialCsvData);
  const [columns, setColumns]          = useState(initialColumns);
  const [file]             = useState(initialFile);
  const [preserveCharts]   = useState(initialCharts);
  const [currentSelections]= useState(initialSelections);
  const [filteredData, setFilteredData]       = useState(initialFiltered);
  const [savedVariables, setSavedVariables]   = useState(initialVariables);
  const [savedCalculations, setSavedCalculations] = useState(initialHistory);

  const [selectedColumn, setSelectedColumn] = useState("");
  const [calculationType, setCalculationType] = useState("sum");
  const [result, setResult] = useState(null);
  const [variableName, setVariableName] = useState("");
  const [calculatorInput, setCalculatorInput] = useState("");
  const [error, setError] = useState(null);

  // 3) Persist everything on change
  useEffect(() => {
    const toSave = {
      csvData,
      columns,
      file,
      preserveCharts,
      currentSelections,
      filteredData,
      savedVariables,
      savedCalculations
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
    savedCalculations
  ]);

  // 4) Table filter callback
  const handleFilterChange = useCallback((newFiltered) => {
    setFilteredData(prev =>
      JSON.stringify(prev) !== JSON.stringify(newFiltered)
        ? newFiltered
        : prev
    );
  }, []);

  // 5) Compute sum/mean/median/mode
  const calculateStatistic = () => {
    if (!selectedColumn) {
      setError("Please select a column first");
      return;
    }
    try {
      const vals = filteredData
        .map(r => parseFloat(r[selectedColumn]))
        .filter(v => !isNaN(v));
      if (!vals.length) throw new Error("No valid numbers in column");

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
          const m = Math.floor(vals.length/2);
          calc = vals.length %2
            ? vals[m]
            : (vals[m-1]+vals[m])/2;
          break;
        case "mode":
          const freq = {};
          vals.forEach(v => (freq[v] = (freq[v]||0)+1));
          let maxF=0, modes=[];
          for (const v in freq) {
            if (freq[v] > maxF) {
              maxF = freq[v];
              modes = [Number(v)];
            } else if (freq[v] === maxF) {
              modes.push(Number(v));
            }
          }
          calc = modes.length===1 ? modes[0] : modes;
          break;
        default:
          throw new Error("Invalid type");
      }
      setResult({value:calc, type:calculationType});
      setError(null);
    } catch(e) {
      setError(e.message);
      setResult(null);
    }
  };

  // 6) Save a named variable
  const saveVariable = () => {
    if (!variableName.trim()) {
      setError("Please enter a variable name");
      return;
    }
    if (!result) {
      setError("No result to save");
      return;
    }
    setSavedVariables(prev=>[
      ...prev,
      {name:variableName, value:result.value, column:selectedColumn, type:calculationType}
    ]);
    setVariableName("");
    setError(null);
  };

  // 7) Save a calculator expression into history
  const saveCalculation = () => {
    if (!calculatorInput.trim()) {
      setError("Please enter a calculation first");
      return;
    }
    try {
      const scope = {};
      savedVariables.forEach(v=>scope[v.name]=v.value);
      const varsInExpr = calculatorInput.match(/[a-zA-Z_][\w]*/g)||[];
      const undefinedVars = varsInExpr.filter(n=>
        !savedVariables.some(v=>v.name===n) && !math[n]
      );
      if (undefinedVars.length) {
        throw new Error(`Undefined variables: ${undefinedVars.join(", ")}`);
      }
      const res = math.evaluate(calculatorInput, scope);
      setSavedCalculations(prev=>[
        {formula:calculatorInput, result:res, timestamp:new Date().toLocaleString()},
        ...prev
      ]);
      setError(null);
    } catch(err) {
      setError("Calculation error: "+err.message);
    }
  };

  // 8) PDF generation
  const generateFormulaPDF = async () => {
    if (savedCalculations.length===0 && savedVariables.length===0) {
      setError("No calculations or variables to export");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("calculations", JSON.stringify(savedCalculations));
      formData.append("variables", JSON.stringify(savedVariables));
      formData.append("companyName", file?.name || "Data Analysis");
      formData.append("chartCount","0");
      if (file) {
        formData.append("fileName", file.name);
        formData.append("fileType","CSV");
        formData.append("rowsCount", csvData.length.toString());
        formData.append("columnsCount", columns.length.toString());
        formData.append("dataPointsCount", (csvData.length*columns.length).toString());
        formData.append("columnNames", columns.join(","));
      }
      const resp = await fetch("http://localhost:8000/api/pdf/generate-report/", {
        method:"POST",
        body: formData
      });
      if (!resp.ok) {
        const errData = await resp.json().catch(()=>({}));
        throw new Error(errData.error||"PDF gen failed");
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file?.name.replace(/\s+/g,"_")||"calculations"}_report.pdf`;
      document.body.appendChild(link);
      link.click();
      setTimeout(()=>{
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },100);
    } catch(e) {
      setError("PDF Generation Error: "+ e.message);
    }
  };

  // 9) Navigation
  const handleUploadAnother = () =>
    navigate("/upload-page",{state:{preserveVariables:savedVariables,preserveCharts}});
  const handleBackToDisplay = () =>
    navigate("/Display-Page",{state:{
      csvData, columns, file, preserveCharts,
      preserveVariables:savedVariables,
      currentSelections
    }});

  const deleteVariable    = idx => setSavedVariables(prev=>prev.filter((_,i)=>i!==idx));
  const deleteCalculation = idx => setSavedCalculations(prev=>prev.filter((_,i)=>i!==idx));

  const getResultLabel = ()=>
    ({sum:"Sum", mean:"Mean", median:"Median", mode:"Mode"}[calculationType]);

  const infoText = "Avoid spaces or special characters in the variable name. Only underscore (_) is allowed.";

  return (
    <section className="bg-displayBg bg-no-repeat bg-cover bg-bottom w-full min-h-screen flex flex-col items-center">
      {/* sidebars */}
      <div className="flex w-full"><TableSidebar/><GraphSidebar/></div>
      {/* logo */}  
      <div className="m-10 w-48 h-12 bg-logo bg-no-repeat bg-cover bg-center"/>

      {/* controls */}
      <div className="w-2/3 flex justify-between items-center p-2 text-white font-inter">
        <div className="flex flex-col space-y-6 w-3/4">
          <div className="grid grid-cols-3 gap-4">
            <select
              className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400"
              value={selectedColumn}
              onChange={e=>setSelectedColumn(e.target.value)}
            >
              <option value="">Select Column</option>
              {columns.map((c,i)=><option key={i} value={c}>{c}</option>)}
            </select>
            <select
              className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400"
              value={calculationType}
              onChange={e=>setCalculationType(e.target.value)}
            >
              <option value="sum">Sum</option>
              <option value="mean">Mean</option>
              <option value="median">Median</option>
              <option value="mode">Mode</option>
            </select>
            <button
              className="w-full p-3 bg-yellow-500 text-black font-bold rounded-lg
                         hover:bg-yellow-600 transition duration-300"
              onClick={calculateStatistic}
            >CALCULATE</button>
          </div>

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
                  className="flex-1 p-3 bg-gray-800 text-white rounded border border-gray-500
                             focus:outline-none focus:border-yellow-400"
                  placeholder="Variable name"
                  value={variableName}
                  onChange={e=>setVariableName(e.target.value)}
                />
                <button
                  className="p-3 bg-green-500 text-white font-bold rounded-lg
                             hover:bg-green-600 transition duration-300"
                  onClick={saveVariable}
                >SAVE</button>
              </div>
              <p className="text-xs text-gray-400 mb-2 col-span-2">{infoText}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col w-1/4 self-end">
          <button
            className="w-36 h-12 mx-10 mb-3 p-3 bg-cyan-500 text-white font-bold rounded-lg
                       hover:bg-blue-600 transition duration-300 flex items-center justify-center gap-2"
            onClick={handleBackToDisplay}
          >
            <FaChartLine/> BACK TO DISPLAY
          </button>
          <button
            className="w-36 h-24 mx-10 mb-5 text-xl bg-yellow-500 text-black font-bold rounded-lg
                       hover:bg-yellow-600 transition duration-300"
            onClick={handleUploadAnother}
          >
            UPLOAD <br/> ANOTHER <br/> CSV
          </button>
        </div>
      </div>

      {/* error */}
      {error && (
        <div className="w-10/12 bg-red-900/90 text-white p-3 rounded-lg mb-3 flex items-start">
          <span>Error: {error}</span>
        </div>
      )}

      {/* table */}
      <div className="w-10/12 flex justify-center my-10">
        {csvData.length
          ? <CsvTable columns={columns} csvData={csvData} onFilterChange={handleFilterChange}/>
          : <p className="text-white text-lg">No CSV data available.</p>
        }
      </div>

      {/* saved variables */}
      {savedVariables.length>0 && (
        <div className="w-10/12 bg-gray-800 p-6 rounded-lg mb-10">
          <h3 className="text-white text-xl font-bold mb-4">Saved Variables</h3>
          <div className="grid grid-cols-3 gap-4">
            {savedVariables.map((v,i)=>(
              <div key={i} className="bg-gray-700 p-3 rounded border border-gray-600
                                      hover:bg-gray-600 transition relative group">
                <button
                  className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100"
                  onClick={()=>deleteVariable(i)}
                  title="Delete variable"
                ><FaTrash/></button>
                <div className="cursor-pointer" onClick={()=>
                  setCalculatorInput(prev=> prev + v.name)
                }>
                  <p className="text-yellow-400 font-bold">{v.name}</p>
                  <p className="text-white">{v.type}:{" "}
                    {Array.isArray(v.value)? v.value.join(", "): v.value}
                  </p>
                  <p className="text-gray-400 text-sm">From column: {v.column}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* calculator */}
      <Calculator 
        input={calculatorInput}
        setInput={setCalculatorInput}
        savedVariables={savedVariables}
      />

      {/* history & PDF */}
      <div className="w-10/12 flex flex-col items-end my-4">
        <button
          className="p-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600
                     transition duration-300 mb-3"
          onClick={saveCalculation}
        >SAVE CALCULATION</button>

        {savedCalculations.length>0 && (
          <div className="w-full bg-gray-800/90 p-4 rounded-lg border border-gray-700 mb-4">
            <h3 className="text-white text-lg font-bold mb-3">Calculation History</h3>
            <div className="space-y-3">
              {savedCalculations.map((calc,i)=>(
                <div key={i} className="bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700
                                        transition flex justify-between items-start">
                  <div>
                    <p className="text-yellow-400 truncate font-mono text-sm">
                      {calc.formula}
                    </p>
                    <p className="text-white font-mono mt-1 text-sm">
                      = {typeof calc.result==="number"
                        ? calc.result.toLocaleString(undefined,{maximumFractionDigits:2})
                        : calc.result}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {calc.timestamp}
                    </p>
                  </div>
                  <button
                    className="text-red-400 hover:text-red-300 ml-3 p-1"
                    onClick={()=>deleteCalculation(i)}
                    title="Delete calculation"
                  ><FaTrash size={14}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          className="w-36 h-24 mx-10 mb-5 text-xl bg-yellow-500 text-black font-bold rounded-lg
                     hover:bg-yellow-600 transition duration-300"
          onClick={generateFormulaPDF}
          disabled={savedCalculations.length===0 && savedVariables.length===0}
        >
          {savedCalculations.length>0 || savedVariables.length>0
            ? "GENERATE\nPDF"
            : "NO\nCALCULATIONS"}
        </button>
      </div>
    </section>
  );
};

export default FormulaPage;
