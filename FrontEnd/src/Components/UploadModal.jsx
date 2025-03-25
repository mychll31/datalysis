import React from "react";

const UploadModal = ({ show, onClose, file, columns, csvData, rowsCount, totalDataPoints, handleConfirm }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center drop-shadow-2xl">
            <div className="bg-gray-800 dark:bg-gray-800 p-6 rounded-lg shadow-lg relative flex flex-col max-w-screen-lg">
                {/* Close Button */}
                <button 
                    className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100" 
                    onClick={onClose}
                >
                    &times;
                </button>

                <h3 className="text-lg font-semibold mb-4">Preview</h3>

                <div className="overflow-auto max-h-80 border border-gray-300 rounded-lg">
                    <table className="table-auto text-gray-900 w-full border-collapse">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                {columns.map((col, index) => (
                                    <th key={index} className="border border-gray-400 px-4 py-2 text-left">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(csvData) && csvData.length > 0 ? (
                                csvData.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="even:bg-gray-100 odd:bg-gray-300 hover:bg-gray-200">
                                        {columns.map((col, colIndex) => (
                                            <td key={colIndex} className="border border-gray-400 px-4 py-2">
                                                {typeof row[col] === "object" ? JSON.stringify(row[col]) : row[col]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="text-center py-4">
                                        No data to display.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 text-left text-gray-500 dark:text-gray-100 flex gap-5">
                    <p><strong>File Name:</strong> {file?.name}</p>
                    <p><strong>Rows:</strong> {rowsCount.toLocaleString()}</p>
                    <p><strong>Columns:</strong> {columns.length.toLocaleString()}</p>
                    <p><strong>Type:</strong> {file?.type.toUpperCase()}</p>
                    <p><strong>Data Points:</strong> {totalDataPoints.toLocaleString()}</p>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                        Close
                    </button>
                    <button onClick={handleConfirm} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                        Confirm Upload
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;