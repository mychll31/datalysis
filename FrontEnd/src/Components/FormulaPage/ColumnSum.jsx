import React from "react";

const ColumnSum = ({ csvData, selectedColumn }) => {
  if (!selectedColumn || !csvData || csvData.length === 0) {
    return <p className="text-white">Please select a column to sum.</p>;
  }

  const numericValues = csvData
    .map(row => parseFloat(row[selectedColumn]))
    .filter(val => !isNaN(val));

  const sum = numericValues.reduce((acc, val) => acc + val, 0);

  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md mt-4 w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Sum of {selectedColumn}:</h2>
      <p className="text-2xl text-yellow-400">{sum}</p>
    </div>
  );
};

export default ColumnSum;
