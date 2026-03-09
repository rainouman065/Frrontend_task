import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { endpoints, useApiQuery } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

function Locations() {
  const navigate = useNavigate();

  const { data: locations = [], isLoading: loading, error: queryError } = useApiQuery({
    queryKey: ['locations'],
    url: endpoints.locations,
    select: (data) => (Array.isArray(data) ? data : []),
  });

  const error = queryError?.message;

  // --- Fully Controlled TanStack Table Setup ---
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: info => <span className="text-slate-500 font-mono text-xs">{info.getValue()}</span>
    },
    {
      accessorKey: 'name',
      header: 'Location Name',
      cell: info => <span className="font-semibold text-slate-800">{info.getValue()}</span>
    },
    {
      accessorKey: 'address',
      header: 'Address',
      cell: info => <span className="text-slate-600">{info.getValue() || '-'}</span>
    },
    {
      id: 'region',
      header: 'Region',
      accessorFn: row => [row.city, row.state, row.country].filter(Boolean).join(', '),
      cell: info => <span className="text-slate-600">{info.getValue()}</span>
    }
  ], []);

  const table = useReactTable({
    data: locations,
    columns,
    state: {
      pagination,
      sorting,
      globalFilter,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading Locations..." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header section */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Locations</h1>
        <button type="button" onClick={() => navigate(-1)} className="px-5 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition">
          Back
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-200">
          {error}
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">Search:</span>
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search locations..."
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">Rows per page:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition shadow-sm"
            >
              {[4, 8, 12, 20, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="bg-slate-50 border-b border-slate-200">
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="px-4 py-3 text-sm font-semibold text-slate-600 whitespace-nowrap"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none flex items-center gap-2 hover:text-slate-900 transition-colors'
                              : 'flex items-center gap-2',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <span className="text-blue-600 ml-1">▲</span>,
                            desc: <span className="text-blue-600 ml-1">▼</span>,
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-3 text-sm text-slate-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="p-8 text-center text-slate-500 font-medium">
                    No locations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{table.getRowModel().rows.length}</span> of <span className="font-semibold text-slate-900">{table.getPrePaginationRowModel().rows.length}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
            >
              {'<<'}
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
            >
              {'<'}
            </button>
            <span className="flex items-center gap-1 mx-2 text-sm text-slate-600">
              Page
              <strong className="text-slate-900">
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
              </strong>
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
            >
              {'>'}
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
            >
              {'>>'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Locations;
