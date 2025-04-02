import { useState } from 'react';

const PredictionTable = ({ predictions }) => {
  return (
    <table className="table-auto border-collapse border border-gray-400">
      <thead>
        <tr>
          {Object.keys(predictions[0]).map((key) => (
            <th key={key} className="border border-gray-300 px-4 py-2">{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {predictions.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((value, idx) => (
              <td key={idx} className="border border-gray-300 px-4 py-2">{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PredictionTable;
