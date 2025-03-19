import React from "react";
import { useLocation } from "react-router-dom";
import GraphSidebar from "../Components/SidebarForGraph";
import TableSidebar from "../Components/SidebarForTable";
import { LineGraph } from "../Components/Line";
import CsvTable from "../Components/CsvTable"; // Import the new component
import { PieChart } from "../Components/Pie"; 
import { BarGraph } from "../Components/Bar";

const Display = () => {
    const location = useLocation();
    const { csvData = [], columns = [] } = location.state || {}; // Get data from navigation state

    return (
        <section className="bg-displayBg bg-no-repeat bg-cover bg-bottom w-full min-h-screen flex flex-col items-center">
            {/* Sidebar */}
            <div className="flex w-full">
                <TableSidebar />
                <GraphSidebar />
            </div>

            {/* Logo */}
            <div className="m-10 w-48 h-12 bg-logo bg-no-repeat bg-cover bg-center"></div>

            {/* Main Content with Two Columns */}
            <div className="w-2/3 flex justify-between items-end p-6 text-white font-inter">
                
                {/* Left Column: Search, Dropdowns, and Apply Button */}
                <div className="flex flex-col space-y-6 w-3/4">
                    {/* Search Bar */}
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

                    {/* Dropdown Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <select className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400">
                            <option>Select a Column</option>
                        </select>
                        <select className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400">
                            <option>Set Range</option>
                        </select>
                    </div>

                    {/* Second Row of Dropdowns & Apply Button */}
                    <div className="grid grid-cols-2 gap-4">
                        <select className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400">
                            <option>Select a Column</option>
                        </select>

                        <div className="flex gap-4">
                            <select className="w-full p-3 bg-gray-800 text-white rounded border border-gray-500 focus:outline-none focus:border-yellow-400">
                                <option>Output (Chart)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Right Column: Upload CSV Button (Moved to Bottom Left) */}
                <div className="flex flex-col w-1/4 self-end">
                    <button className="w-36 h-24 mx-10 mb-5 text-xl bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition duration-300">
                        UPLOAD <br /> ANOTHER <br /> CSV
                    </button>
                    <button className="w-36 h-12 mx-10 mb-3 text-lg bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition duration-300">
                        APPLY
                    </button>
                </div>
            </div>

            {/* Display CSV Table */}
            <div className="w-2/3 my-10 ">
                {csvData.length > 0 ? (
                    <CsvTable columns={columns} csvData={csvData} />
                ) : (
                    <p className="text-white text-lg">No CSV data available.</p>
                )}
            </div>

            {/* Graph Display */}
            <div className="w-full pb-10 flex justify-center">
                <div className="w-2/5">
                    <div className="App bg-white border-gray-900 border-8 shadow-xl "> 
                        <LineGraph /> 
                    </div>
                </div>
                <div className="w-1/4 ml-10 ">
                    <div className="App bg-white border-gray-900 border-8 shadow-xl "> 
                        <PieChart /> 
                    </div>
                </div>
            </div>
                <div className="w-1/2 ml-10 pb-10 ">
                    <div className="App bg-white border-gray-900 border-8 shadow-xl "> 
                        <BarGraph /> 
                    </div>
                </div>

        </section>
    );
};

export default Display;
``
