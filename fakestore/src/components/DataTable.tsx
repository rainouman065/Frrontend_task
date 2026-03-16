import React, { ReactElement } from 'react';
import { flexRender, Table } from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import TablePagination from './TablePagination';

interface DataTableProps<T> {
    table: Table<T>;
    centeredColumns?: string[];
}

const DataTable = <T extends unknown>({ table, centeredColumns = ['status'] }: DataTableProps<T>) => {
    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto relative">
                <table className="w-full text-left border-collapse">
                    {/* Table Head */}
                    <thead className="sticky top-0 z-[21] bg-white/95 backdrop-blur-sm shadow-sm">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="border-b border-slate-100">
                                {headerGroup.headers.map(header => {
                                    const isCentered = centeredColumns.includes(header.id);
                                    const isActions = header.id === 'actions';
                                    return (
                                        <th
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className={`px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors
                                                ${header.column.getCanSort() ? 'cursor-pointer hover:text-primary-600 select-none' : ''}
                                                ${isActions ? 'text-right sticky right-0 bg-white/95 backdrop-blur-sm z-[22]' : ''}
                                                ${isCentered ? 'text-center' : ''}
                                            `}
                                        >
                                            <div className={`flex items-center gap-2
                                                ${isActions ? 'justify-end' : ''}
                                                ${isCentered ? 'justify-center' : ''}
                                            `}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanSort() && (
                                                    <div className="w-4 h-4 flex items-center justify-center">
                                                        {{
                                                            asc: <ChevronUp size={12} className="text-primary-600" />,
                                                            desc: <ChevronDown size={12} className="text-primary-600" />,
                                                        }[header.column.getIsSorted() as string] ?? <ChevronsUpDown size={10} className="text-slate-300" />}
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-slate-50">
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-slate-50/50 transition-all group">
                                {row.getVisibleCells().map(cell => (
                                    <td
                                        key={cell.id}
                                        className={`px-10 py-8
                                            ${cell.column.id === 'actions'
                                                ? 'text-right sticky right-0 bg-white/60 backdrop-blur-md z-[20] shadow-[-20px_0_30px_-15px_rgba(0,0,0,0.05)] group-hover:bg-slate-50/90 transition-all'
                                                : ''
                                            }
                                        `}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <TablePagination table={table} />
        </div>
    );
};

export default DataTable;
