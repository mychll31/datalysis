import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

const CsvTable = ({ columns: csvColumns, csvData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumn, setSelectedColumn] = useState(csvColumns[0]);
  const [filterValue, setFilterValue] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [columnFilters, setColumnFilters] = useState([]);

  // Prepare columns for react-table
  const columns = useMemo(() => (
    csvColumns.map(col => ({
      accessorKey: col,
      header: col,
      cell: info => info.getValue(),
      meta: {
        isNumeric: csvData.some(row => !isNaN(parseFloat(row[col])) && isFinite(row[col])),
        isDate: csvData.some(row => !isNaN(Date.parse(row[col])))
      }
    }))
  ), [csvColumns, csvData]);

  // Global filter function
  const globalFilterFn = (row, columnId, filterValue) => {
    return String(row.getValue(columnId)).toLowerCase().includes(filterValue.toLowerCase());
  };

  // Column filter functions
  const columnFilterFn = (row, columnId, filterValue) => {
    const value = row.getValue(columnId);
    const columnMeta = columns.find(c => c.accessorKey === columnId)?.meta;
    
    if (filterValue.includes('-') && (columnMeta?.isNumeric || columnMeta?.isDate)) {
      const [min, max] = filterValue.split('-').map(v => v.trim());
      
      if (columnMeta.isNumeric) {
        const numValue = parseFloat(value);
        const minNum = parseFloat(min);
        const maxNum = parseFloat(max);
        return !isNaN(numValue) && numValue >= minNum && numValue <= maxNum;
      }
      
      if (columnMeta.isDate) {
        const dateValue = new Date(value);
        const minDate = new Date(min);
        const maxDate = new Date(max);
        return !isNaN(dateValue) && dateValue >= minDate && dateValue <= maxDate;
      }
    }
    
    return String(value).toLowerCase().includes(filterValue.toLowerCase());
  };

  // Create the table instance
  const table = useReactTable({
    data: csvData,
    columns,
    state: {
      columnFilters,
      globalFilter: searchTerm
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setSearchTerm,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn,
    filterFns: {
      columnFilter: columnFilterFn
    }
  });

  const addFilter = () => {
    if (selectedColumn && filterValue) {
      setColumnFilters(prev => [
        ...prev.filter(f => f.id !== selectedColumn),
        { id: selectedColumn, value: filterValue }
      ]);
      setFilterValue('');
    }
  };

  const removeFilter = columnId => {
    setColumnFilters(prev => prev.filter(f => f.id !== columnId));
  };

  const clearAllFilters = () => {
    setColumnFilters([]);
    setSearchTerm('');
  };

  const getFilterPlaceholder = () => {
    const column = columns.find(c => c.accessorKey === selectedColumn);
    if (column?.meta?.isNumeric) return "e.g., 10-100";
    if (column?.meta?.isDate) return "e.g., 2023-01-01 - 2023-12-31";
    return "Filter value";
  };

  return (
    <div className="mt-8 w-full bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">CSV Data Table</h2>
      
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Search Bar */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search all columns..."
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Show All Toggle */}
        <button
          className={`px-4 py-2 rounded ${showAll ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Restrict Height" : "Show All Rows"}
        </button>
      </div>
      
      {/* Filter Controls */}
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <select
          className="p-2 rounded bg-gray-700 text-white border border-gray-600"
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
        >
          {csvColumns.map((col, index) => (
            <option key={index} value={col}>
              {col} {columns.find(c => c.accessorKey === col)?.meta?.isNumeric ? "(num)" : 
                    columns.find(c => c.accessorKey === col)?.meta?.isDate ? "(date)" : ""}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder={getFilterPlaceholder()}
          className="p-2 rounded bg-gray-700 text-white border border-gray-600"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          onClick={addFilter}
        >
          Add Filter
        </button>
        
        {/* Active filters */}
        {columnFilters.length > 0 && (
          <div className="ml-2 text-sm text-gray-300">
            Active filters:
            {columnFilters.map(({ id, value }) => (
              <span key={id} className="ml-2 bg-gray-700 px-2 py-1 rounded inline-flex items-center">
                {id}: {value}
                <button 
                  onClick={() => removeFilter(id)}
                  className="ml-1 text-red-400 hover:text-red-300"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Table */}
      <div className={`overflow-auto border border-gray-700 rounded-lg`} style={{ maxHeight: showAll ? 'none' : '70vh' }}>
        <table className="table-auto min-w-full text-white border-collapse">
          <thead className="bg-gray-700 sticky top-0">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    className="border border-gray-600 px-4 py-2 text-left cursor-pointer hover:bg-gray-600 whitespace-nowrap"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center justify-between">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: '↑',
                        desc: '↓',
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="even:bg-gray-600 odd:bg-gray-700 hover:bg-gray-500">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="border border-gray-600 px-4 py-2 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-gray-400">
                  No data found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Data summary */}
      <div className="mt-2 text-sm text-gray-400">
        Showing {table.getRowModel().rows.length} of {csvData.length} rows
        {columnFilters.length > 0 && (
          <button 
            onClick={clearAllFilters}
            className="ml-4 text-blue-400 hover:text-blue-300"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
};

export default CsvTable;