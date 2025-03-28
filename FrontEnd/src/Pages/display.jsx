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

const Display = () => {
    const location = useLocation();
    const { csvData = [], columns = [], file } = location.state || {};
    const [targetColumn, setTargetColumn] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleApply = async () => {
        if (!targetColumn) {
            setError("Please select a target column");
            return;
        }
        
        setError(null);
        setSuccess(null);
        setIsProcessing(true);
    
        try {
            const formData = new FormData();
            formData.append('target_column', targetColumn);
    
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
    
            const response = await fetch('http://localhost:8000/upload_csv/', {
                method: 'POST',
                body: formData,
                credentials: 'include' // Important for session/csrf
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
            
            setSuccess("File processed successfully!");
            console.log("Results:", result);
    
        } catch (error) {
            console.error("Full error:", error);
            setError(error.message || "Processing failed. Check console for details.");
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
                            value={targetColumn}
                            onChange={(e) => setTargetColumn(e.target.value)}
                            required
                        >
                            <option value="">Select Target Column</option>
                            {columns.map((col, index) => (
                                <option key={index} value={col}>{col}</option>
                            ))}
                        </select>
                        <select className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400">
                            <option>Set Range</option>
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
                        {isProcessing ? "PROCESSING..." : "APPLY"}
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

            <div className="w-full pb-10 flex justify-center">
                <div className="w-2/5">
                    <div className="App bg-white border-gray-900 border-8 shadow-xl"> 
                        <LineGraph /> 
                    </div>
                </div>
                <div className="w-1/4 ml-10">
                    <div className="App bg-white border-gray-900 border-8 shadow-xl"> 
                        <PieChart /> 
                    </div>
                </div>
            </div>
            <div className="w-1/2 pb-10">
                <div className="App bg-white border-gray-900 border-8 shadow-xl"> 
                    <BarGraph /> 
                </div>
            </div>
            <div className="w-1/2 pb-10">
                <div className="App bg-white border-gray-900 border-8 shadow-xl"> 
                    <RelationshipChart data={RelationshipData}/> 
                </div>
            </div>
            <h2 className="w-1/2 text-center text-lg text-gray-400 font-light">Statistics Summary</h2>
            <StatisticsSummary />
        </section>
    );
};

export default Display;