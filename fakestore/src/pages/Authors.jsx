import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getFilteredRowModel,
    getSortedRowModel,
} from '@tanstack/react-table';
import { fetchAuthors, createAuthor, updateAuthor, deleteAuthor } from '../api';
import { User, Loader2, AlertCircle, Plus, Trash2, Edit3, Star, Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import AuthorModal from '../components/AuthorModal';
import Swal from 'sweetalert2';

const Authors = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAuthor, setEditingAuthor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sorting, setSorting] = useState([]);

    const { data: authors = [], isLoading, isError, error } = useQuery({
        queryKey: ['authors'],
        queryFn: fetchAuthors,
    });

    const createMutation = useMutation({
        mutationFn: createAuthor,
        onSuccess: (newAuthor) => {
            queryClient.setQueryData(['authors'], (old) => [newAuthor, ...(old || [])]);
            setIsModalOpen(false);
            Swal.fire({
                icon: 'success',
                title: 'Author Onboarded (Local)',
                text: 'The database has been updated for this session.',
            });
        },
        onError: (err) => {
            Swal.fire({ icon: 'error', title: 'Add failed', text: err.message });
        }
    });

    const updateMutation = useMutation({
        mutationFn: updateAuthor,
        onSuccess: (updatedAuthor) => {
            queryClient.setQueryData(['authors'], (old) =>
                old.map(a => a.id === updatedAuthor.id ? updatedAuthor : a)
            );
            setIsModalOpen(false);
            setEditingAuthor(null);
            Swal.fire({
                icon: 'success',
                title: 'Author Records Updated',
            });
        },
        onError: (err) => {
            Swal.fire({ icon: 'error', title: 'Update failed', text: err.message });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAuthor,
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData(['authors'], (old) =>
                old.filter(a => a.id !== deletedId)
            );
            Swal.fire({
                icon: 'success',
                title: 'Author Entity Deleted',
            });
        },
        onError: (err) => {
            Swal.fire({ icon: 'error', title: 'Delete failed', text: err.message });
        }
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete Author?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id);
            }
        });
    };

    const handleEdit = (author) => {
        setEditingAuthor(author);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingAuthor(null);
        setIsModalOpen(true);
    };

    const handleSubmit = (formData) => {
        if (editingAuthor) {
            updateMutation.mutate({ id: editingAuthor.id, author: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    // TanStack Table Column Definitions
    const columns = useMemo(() => [
        {
            header: 'Creator Identity',
            accessorFn: row => `${row.firstName} ${row.lastName}`,
            id: 'name',
            cell: ({ row }) => {
                const author = row.original;
                return (
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 p-0.5 group-hover:rotate-6 transition-transform duration-300 shadow-lg shadow-primary-500/20">
                            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center">
                                <span className="text-[10px] font-black text-primary-600 uppercase italic">
                                    {author.firstName[0]}{author.lastName[0]}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-slate-800 group-hover:text-primary-600 transition-colors tracking-tight text-lg leading-tight">
                                {author.firstName} {author.lastName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Official Contributor</span>
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Database Info',
            id: 'info',
            accessorKey: 'id',
            cell: ({ row }) => {
                const author = row.original;
                return (
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">Record ID</span>
                            <span className="font-black text-slate-700 text-sm mt-1"># {author.id}</span>
                        </div>
                        <div className="w-px h-8 bg-slate-100" />
                        <div className="flex flex-col">
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none">Linked Book</span>
                            <span className="font-black text-slate-700 text-sm mt-1">REF: {author.idBook}</span>
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Status',
            id: 'status',
            enableSorting: false,
            cell: () => (
                <div className="flex justify-center">
                    <span className="flex items-center gap-2 px-4 py-1.5 bg-accent-50 text-accent-700 rounded-full text-[9px] font-black uppercase tracking-widest border border-accent-100 shadow-sm">
                        <Star size={10} fill="currentColor" />
                        Premier
                    </span>
                </div>
            )
        },
        {
            header: 'Management',
            id: 'actions',
            enableSorting: false,
            cell: ({ row }) => {
                const author = row.original;
                return (
                    <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(author)} className="p-3 bg-white hover:bg-slate-900 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-100 hover:border-slate-800 shadow-sm">
                            <Edit3 size={18} />
                        </button>
                        <button onClick={() => handleDelete(author.id)} className="p-3 bg-white hover:bg-rose-600 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-100 hover:border-rose-500 shadow-sm">
                            <Trash2 size={18} />
                        </button>
                    </div>
                );
            }
        }
    ], []);

    const table = useReactTable({
        data: authors,
        columns,
        state: {
            globalFilter: searchTerm,
            sorting,
        },
        onGlobalFilterChange: setSearchTerm,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <Loader2 className="animate-spin text-primary-600" size={48} />
                <p className="text-slate-500 font-medium animate-pulse tracking-[0.2em] uppercase text-[10px]">Accessing Database...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 mb-20">
            {/* Sticky Header Section */}
            <div className="sticky top-[104px] z-[30] glass-header py-6 px-4 -mx-4 flex flex-col md:flex-row justify-between items-center gap-6 transition-all duration-300">
                <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">Global Creators</h3>
                    <p className="text-sm text-slate-400 mt-2 font-medium italic">"Managing a database of {authors?.length || 0} elite literary figures."</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search contributors..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold shadow-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 outline-none transition-all placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        className="w-full md:w-auto px-6 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 active:scale-95 group"
                    >
                        <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                        Add Author
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto relative">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-[21] bg-white shadow-sm">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="border-b border-slate-100">
                                    {headerGroup.headers.map(header => (
                                        <th 
                                            key={header.id} 
                                            onClick={header.column.getToggleSortingHandler()}
                                            className={`px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors ${
                                                header.column.getCanSort() ? 'cursor-pointer hover:text-primary-600 select-none' : ''
                                            } ${
                                                header.id === 'actions' ? 'text-right sticky right-0 bg-white z-[22]' : 
                                                header.id === 'status' ? 'text-center' : ''
                                            }`}
                                        >
                                            <div className={`flex items-center gap-2 ${header.id === 'actions' ? 'justify-end' : header.id === 'status' ? 'justify-center' : ''}`}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanSort() && (
                                                    <div className="w-4 h-4 flex items-center justify-center">
                                                        {{
                                                            asc: <ChevronUp size={12} className="text-primary-600" />,
                                                            desc: <ChevronDown size={12} className="text-primary-600" />,
                                                        }[header.column.getIsSorted()] ?? <ChevronsUpDown size={10} className="text-slate-300" />}
                                                    </div>
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-slate-50/50 transition-all group">
                                    {row.getVisibleCells().map(cell => (
                                        <td 
                                            key={cell.id} 
                                            className={`px-10 py-8 ${
                                                cell.column.id === 'actions' ? 'text-right sticky right-0 bg-white/60 backdrop-blur-md z-[20] shadow-[-20px_0_30px_-15px_rgba(0,0,0,0.05)] group-hover:bg-slate-50/90 transition-all' : ''
                                            }`}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AuthorModal
                key={editingAuthor ? `edit-author-${editingAuthor.id}` : 'create-author'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                author={editingAuthor}
                isEdit={!!editingAuthor}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />
        </div>
    );
};

export default Authors;
