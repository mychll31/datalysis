import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table';

const CsvTable = ({ columns: csvColumns, csvData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumn, setSelectedColumn] = useState(csvColumns[0]);
  const [filterValue, setFilterValue] = useState('');
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

  // Create the table instance with pagination
  const table = useReactTable({
    data: csvData,
    columns,
    state: {
      columnFilters,
      globalFilter: searchTerm,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setSearchTerm,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 20, // Default page size
      },
    },
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

  // Enhanced pagination controls
const getPageNumbers = () => {
  const currentPage = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const pages = [];
  const maxVisiblePages = 5; // Number of page buttons to show

  if (pageCount <= maxVisiblePages) {
    // Show all pages if there aren't too many
    for (let i = 0; i < pageCount; i++) {
      pages.push(i);
    }
  } else {
    // Skip showing page 1 (index 0) when we're on page 4 or later
    const shouldShowFirstPage = currentPage < 3;

    if (shouldShowFirstPage) {
      pages.push(0); // Show first page only when needed
    }

    // Calculate range around current page
    let start = Math.max(shouldShowFirstPage ? 1 : 0, currentPage - 1);
    let end = Math.min(pageCount - (shouldShowFirstPage ? 2 : 1), currentPage + 1);

    // Adjust if we're at the start or end
    if (currentPage <= 2) {
      end = shouldShowFirstPage ? 3 : 2;
    } else if (currentPage >= pageCount - 3) {
      start = pageCount - 4;
    }

    // Add ellipsis if needed before current range
    if (start > (shouldShowFirstPage ? 1 : 0)) {
      pages.push('...');
    }

    // Add pages in current range
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed after current range
    if (end < pageCount - (shouldShowFirstPage ? 2 : 1)) {
      pages.push('...');
    }

    // Always show last page unless it's already included
    if (end < pageCount - 1) {
      pages.push(pageCount - 1);
    }
  }

  return pages;
};

// In your JSX where you render the pagination buttons:
{getPageNumbers().map((page, index) => (
  page === 'left-ellipsis' || page === 'right-ellipsis' ? (
    <span
      key={index}
      className="px-2 py-1 text-xs text-gray-400 cursor-default"
    >
      ...
    </span>
  ) : (
    <button
      key={index}
      className={`px-2 py-1 text-xs rounded ${
        page === table.getState().pagination.pageIndex
          ? 'bg-blue-600 text-white'
          : 'bg-gray-700 text-white hover:bg-gray-600'
      } border border-gray-600`}
      onClick={() => table.setPageIndex(page)}
    >
      {page + 1}
    </button>
  )
))}

  return (
    <div className="w-full bg-gray-800 p-2 rounded-lg shadow-lg">
      {/* Compact Controls */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <input
          type="text"
          placeholder="Search all columns..."
          className="flex-1 min-w-[150px] p-1 text-sm rounded bg-gray-700 text-white border border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="p-1 text-sm rounded bg-gray-700 text-white border border-gray-600"
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
        >
          {csvColumns.map((col, index) => (
            <option key={index} value={col}>{col}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filter value"
          className="p-1 text-sm rounded bg-gray-700 text-white border border-gray-600"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 text-sm rounded"
          onClick={addFilter}
        >
          + Filter
        </button>

        {columnFilters.length > 0 && (
          <button
            className="text-red-400 hover:text-red-300 text-sm"
            onClick={clearAllFilters}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active filters */}
      {columnFilters.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {columnFilters.map(({ id, value }) => (
            <span key={id} className="text-xs bg-gray-700 text-white px-2 py-0.5 rounded inline-flex items-center">
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

      {/* Compact Table */}
      <div className="overflow-auto border border-gray-700 rounded-lg" style={{ maxHeight: '65vh' }}>
        <table className="min-w-full text-white border-collapse">
          <thead className="bg-gray-700 sticky top-0">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="border border-gray-600 px-2 py-1 text-left text-sm cursor-pointer hover:bg-gray-600 whitespace-nowrap"
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
          <tbody className="text-xs">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="even:bg-gray-600 odd:bg-gray-700 hover:bg-gray-500">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="border border-gray-600 px-2 py-1 whitespace-nowrap">
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
                <td colSpan={columns.length} className="text-center py-2 text-gray-400 text-xs">
                  No matching data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination Controls */}
      <div className="flex items-center justify-between mt-2 px-1">
        <div className="text-xs text-gray-400">
          Showing{' '}
          <span className="font-medium text-white">
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-medium text-white">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </span>{' '}
          of{' '}
          <span className="font-medium text-white">
            {table.getFilteredRowModel().rows.length}
          </span>{' '}
          rows
        </div>

        <div className="flex items-center gap-1">
          <button
            className="px-2 py-1 text-xs rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            «
          </button>
          <button
            className="px-2 py-1 text-xs rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ‹
          </button>

          {/* Page number buttons */}
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              className={`px-2 py-1 text-xs rounded ${
                page === table.getState().pagination.pageIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              } border border-gray-600`}
              onClick={() => typeof page === 'number' ? table.setPageIndex(page) : null}
              disabled={page === '...'}
            >
              {page === '...' ? '...' : page + 1}
            </button>
          ))}

          <button
            className="px-2 py-1 text-xs rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            ›
          </button>
          <button
            className="px-2 py-1 text-xs rounded bg-gray-700 text-white border border-gray-600 disabled:opacity-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            »
          </button>
        </div>

        <select
          className="p-1 text-xs rounded bg-gray-700 text-white border border-gray-600"
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 50, 100].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CsvTable;
