import React from 'react';

/**
 * Reusable pagination controls for TanStack Table.
 * Props:
 *  - table : TanStack Table instance
 */
const TablePagination = ({ table }) => {
    return (
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
            {/* Left: Page Info + Page Size */}
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:inline-block">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => table.setPageSize(Number(e.target.value))}
                    className="bg-white border border-slate-200 text-slate-600 text-xs rounded-xl focus:ring-primary-500 focus:border-primary-500 block p-2 outline-none font-bold"
                >
                    {[10, 20, 30, 40, 50].map(size => (
                        <option key={size} value={size}>Show {size}</option>
                    ))}
                </select>
            </div>

            {/* Right: Navigation Buttons */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    className="p-2 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-primary-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                    <span className="font-bold text-[10px] uppercase tracking-widest">First</span>
                </button>
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-4 py-2 rounded-xl text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 hover:text-primary-600 disabled:opacity-30 disabled:hover:bg-white transition-all font-bold text-xs"
                >
                    Previous
                </button>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-4 py-2 rounded-xl text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 hover:text-primary-600 disabled:opacity-30 disabled:hover:bg-white transition-all font-bold text-xs"
                >
                    Next
                </button>
                <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    className="p-2 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-primary-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                    <span className="font-bold text-[10px] uppercase tracking-widest">Last</span>
                </button>
            </div>
        </div>
    );
};

export default TablePagination;
