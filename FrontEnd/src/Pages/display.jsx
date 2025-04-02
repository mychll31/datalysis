import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import GraphSidebar from "../Components/SidebarForGraph";
import TableSidebar from "../Components/SidebarForTable";
import { LineGraph } from "../Components/Line";
import CsvTable from "../Components/CsvTable";
import { PieChart } from "../Components/Pie"; 
import { BarGraph } from "../Components/Bar";
import StatisticsSummary from "../Components/StatisticSum";
import { RelationshipChart } from "../Components/RelationshipChart";
import { RelationshipData } from "../Components/FAKE_DATA";
import { InsightComponent } from "../Components/Insights";

const Display = () => {
    const location = useLocation();
    const { csvData = [], columns = [], file } = location.state || {};
    const [targetColumn1, setTargetColumn1] = useState("");
    const [targetColumn2, setTargetColumn2] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleApply = async () => {
        if (!targetColumn1 || !targetColumn2) {
            setError("Please select both target columns");
            return;
        }
        
        setError(null);
        setSuccess(null);
        setIsProcessing(true);
    
        try {
            const formData = new FormData();
            formData.append('target_column1', targetColumn1);
            formData.append('target_column2', targetColumn2);
    
            // Use the original file if available
            if (file) {
                formData.append('file', file);
            } else {
                // Fallback: create CSV from data
                const headers = columns.join(',');
                const rows = csvData.map(row => 
                    columns.map(col => JSON.stringify(row[col])).join(',')
                );
                const csvContent = [headers, ...rows].join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv' });
                formData.append('file', blob, 'data.csv');
            }
    
            const response = await fetch('http://localhost:8000/upload-csv/', { // Changed endpoint
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
    
            // First check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Unexpected response: ${text.substring(0, 100)}`);
            }
    
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || `Server error: ${response.status}`);
            }
            
            setSuccess("Analysis completed successfully!");
            setAnalysisResult(result); // Store the analysis result
            console.log("Analysis Results:", result);
    
        } catch (error) {
            console.error("Full error:", error);
            setError(error.message || "Analysis failed. Check console for details.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <section className="bg-displayBg bg-no-repeat bg-cover bg-bottom w-full min-h-screen flex flex-col items-center">
            <div className="flex w-full">
                <TableSidebar />
                <GraphSidebar />
            </div>

            <div className="m-10 w-48 h-12 bg-logo bg-no-repeat bg-cover bg-center"></div>

            <div className="w-2/3 flex justify-between items-end p-6 text-white font-inter">
                <div className="flex flex-col space-y-6 w-3/4">
                    <div className="relative flex items-center">
                        <input 
                            type="text" 
                            placeholder="Search" 
                            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-500 focus:outline-none focus:border-yellow-400" 
                        />
                        <div className="absolute right-4 text-white cursor-pointer text-xl">
                            &#9776;
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <select 
                            className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400"
                            value={targetColumn1}
                            onChange={(e) => setTargetColumn1(e.target.value)}
                            required
                        >
                            <option value="">Select First Target Column</option>
                            {columns.map((col, index) => (
                                <option key={index} value={col}>{col}</option>
                            ))}
                        </select>
                        <select 
                            className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400"
                            value={targetColumn2}
                            onChange={(e) => setTargetColumn2(e.target.value)}
                            required
                        >
                            <option value="">Select Second Target Column</option>
                            {columns.map((col, index) => (
                                <option key={index} value={col}>{col}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <select className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400">
                            <option>Select a Column</option>
                            {columns.map((col, index) => (
                                <option key={index} value={col}>{col}</option>
                            ))}
                        </select>

                        <div className="flex gap-4">
                            <select className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400">
                                <option>Output (Chart)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-1/4 self-end">
                    <button className="w-36 h-24 mx-10 mb-5 text-xl bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition duration-300">
                        UPLOAD <br /> ANOTHER <br /> CSV
                    </button>
                    <button 
                        className="w-36 h-12 mx-10 mb-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition duration-300"
                        onClick={handleApply}
                        disabled={isProcessing}
                    >
                        {isProcessing ? "PROCESSING..." : "ANALYZE"}
                    </button>
                    {error && (
                        <div className="mx-10 text-red-500 text-sm mb-2">
                            Error: {error}
                        </div>
                    )}
                    {success && (
                        <div className="mx-10 text-green-500 text-sm">
                            {success}
                        </div>
                    )}
                </div>
            </div>

            <div className="w-10/12 flex justify-center my-10">
                {csvData.length > 0 ? (
                    <CsvTable columns={columns} csvData={csvData} />
                ) : (
                    <p className="text-white text-lg">No CSV data available.</p>
                )}
            </div>

            {/* Visualizations - Updated to use analysisResult if available */}
            <div className="w-full pb-10 flex justify-center">
                <div className="w-2/5">
                    <div className="App bg-white border-gray-900 border-8 shadow-xl"> 
                        <LineGraph data={analysisResult?.plot_data} /> 
                    </div>
                </div>
                <div className="w-1/4 ml-10">
                    <div className="App bg-white border-gray-900 border-8 shadow-xl"> 
                        <PieChart data={analysisResult?.plot_data} /> 
                    </div>
                </div>
            </div>
            <div className="w-1/2 pb-10">
                <div className="App bg-white border-gray-900 border-8 shadow-xl"> 
                    <BarGraph data={analysisResult?.plot_data} /> 
                </div>
            </div>
            <div className="w-1/2 pb-10">
                <div className="App bg-white border-gray-900 border-8 shadow-xl"> 
                    <RelationshipChart data={analysisResult || RelationshipData}/> 
                </div>
            </div>
            <h2 className="w-1/2 text-center text-lg text-gray-400 font-light">Statistics Summary</h2>
            <StatisticsSummary stats={analysisResult?.column_stats} />
            <InsightComponent data={analysisResult || RelationshipData}/>
        </section>
    );
};

export default Display;