import React from "react";

const StatisticsSummary = ({ numColumns, numRows, numNumeric, numCategorical, missingPercentage }) => {
    return (
        <div className="w-1/2 bg-darkBlue p-6 rounded-lg flex flex-row align-middle items-center justify-center gap-3 text-white  pb-24">
            
            
            <div className="w-3/4 justify-center grid grid-rows-2 gap-6 grid-cols-2 ">
                {/* No. of Columns */}
                <StatCard label="No. of Columns" value={numColumns} />
                {/* Numeric Columns */}
                <StatCard label="Numeric Columns" value={numNumeric} />
                {/* No. of Rows */}
                <StatCard label="No. of Rows" value={numRows} />
                {/* Categorical Columns */}
                <StatCard label="Categorical Columns" value={numCategorical} />
            </div>
            
            {/* Percentage of Missing Values */}
            <div className="w-1/4 flex justify-center h-full">
                <div className="bg-gray-300 rounded-lg shadow-lg p-8 flex flex-col items-center w-56">
                    <p className="text-sm text-gray-700 mb-2">Percentage of Missing Values</p>
                    <div className="flex">
                        <div className="bg-gray-500 rounded-md w-20 h-16 flex items-center justify-center text-xl font-bold text-white">
                            {missingPercentage}
                        </div>
                        <h1 className="font-light text-gray-900 text-6xl">
                            %
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value }) => {
    return (
        <div className="bg-gray-300 rounded-2xl shadow-lg p-6 flex justify-between items-center w-44">
            <p className="text-sm text-gray-700">{label}</p>
            <div className="bg-gray-500 rounded-md w-20 h-8 flex items-center justify-center text-lg font-bold text-white">
                {value}
            </div>
        </div>
    );
};

export default StatisticsSummary;
