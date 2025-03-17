import React from "react";

const CsvTable = ({ columns, csvData }) => {
  return (
    <div className="mt-8 w-4/5 bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">CSV Data Table</h2>
      <div className="overflow-auto max-h-96 border border-gray-700 rounded-lg">
        <table className="table-auto w-full text-white border-collapse">
          <thead className="bg-gray-700">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="border border-gray-600 px-4 py-2 text-left">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, rowIndex) => (
              <tr key={rowIndex} className="even:bg-gray-600 odd:bg-gray-700">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="border border-gray-600 px-4 py-2">
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CsvTable;
