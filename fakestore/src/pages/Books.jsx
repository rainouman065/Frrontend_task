import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getFilteredRowModel,
    getSortedRowModel,
} from '@tanstack/react-table';
import { fetchBooks, createBook, updateBook, deleteBook } from '../api';
import { BookOpen, Calendar, Hash, Loader2, AlertCircle, Plus, Trash2, Edit3, Search, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import BookModal from '../components/BookModal';
import Swal from 'sweetalert2';

const Books = () => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sorting, setSorting] = useState([]);

    const { data: books = [], isLoading, isError, error } = useQuery({
        queryKey: ['books'],
        queryFn: fetchBooks,
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: createBook,
        onSuccess: (newBook) => {
            queryClient.setQueryData(['books'], (oldBooks) => [newBook, ...(oldBooks || [])]);
            setIsModalOpen(false);
            Swal.fire({
                icon: 'success',
                title: 'Book Added (Local)',
                text: 'Note: This is a fake API. The data is updated locally for this session.',
            });
        },
        onError: (err) => {
            Swal.fire({
                icon: 'error',
                title: 'Failed to add',
                text: err.response?.data?.title || err.message,
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: updateBook,
        onSuccess: (updatedBook) => {
            queryClient.setQueryData(['books'], (oldBooks) =>
                oldBooks.map(b => b.id === updatedBook.id ? updatedBook : b)
            );
            setIsModalOpen(false);
            setEditingBook(null);
            Swal.fire({
                icon: 'success',
                title: 'Book Updated locally',
            });
        },
        onError: (err) => {
            Swal.fire({ icon: 'error', title: 'Update failed', text: err.message });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteBook,
        onSuccess: (_, deletedId) => {
            queryClient.setQueryData(['books'], (oldBooks) =>
                oldBooks.filter(b => b.id !== deletedId)
            );
            Swal.fire({
                icon: 'success',
                title: 'Deleted locally',
            });
        },
        onError: (err) => {
            Swal.fire({ icon: 'error', title: 'Delete failed', text: err.message });
        }
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            confirmButtonText: 'Delete',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id);
            }
        });
    };

    const handleEdit = (book) => {
        setEditingBook(book);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingBook(null);
        setIsModalOpen(true);
    };

    const handleSubmit = (formData) => {
        if (editingBook) {
            updateMutation.mutate({ id: editingBook.id, book: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    // TanStack Table Column Definitions
    const columns = useMemo(() => [
        {
            header: 'Book Overview',
            accessorKey: 'title',
            cell: ({ row }) => {
                const book = row.original;
                return (
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100 group-hover:scale-110 transition-transform duration-300">
                            <BookOpen size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-slate-800 group-hover:text-primary-600 transition-colors tracking-tight text-lg leading-tight line-clamp-1">{book.title}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ENTRY_ID: #{book.id}</span>
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Content Teaser',
            accessorKey: 'description',
            cell: ({ row }) => {
                const book = row.original;
                return (
                    <div className="max-w-md">
                        <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-2 cursor-help" title={book.description}>
                            {book.description || "No description provided."}
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-[9px] font-black text-slate-400 uppercase">Snippet:</span>
                            <span className="text-[9px] text-slate-600 italic line-clamp-1 uppercase tracking-tighter">"{book.excerpt || "No excerpt..."}"</span>
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Properties',
            id: 'properties',
            accessorKey: 'pageCount',
            cell: ({ row }) => {
                const book = row.original;
                return (
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-primary-100 shadow-sm">
                            <Calendar size={12} />
                            {new Date(book.publishDate).getFullYear()}
                        </div>
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100">
                            <Hash size={12} />
                            {book.pageCount} Pages
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Management',
            id: 'actions',
            enableSorting: false,
            cell: ({ row }) => {
                const book = row.original;
                return (
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => handleEdit(book)}
                            className="p-3 bg-white hover:bg-slate-900 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-100 hover:border-slate-800 shadow-sm"
                        >
                            <Edit3 size={18} />
                        </button>
                        <button
                            onClick={() => handleDelete(book.id)}
                            className="p-3 bg-white hover:bg-rose-600 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-100 hover:border-rose-500 shadow-sm"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                );
            }
        }
    ], []);

    const table = useReactTable({
        data: books,
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
                <p className="text-slate-500 font-medium animate-pulse uppercase tracking-[0.2em] text-[10px]">Accessing Library...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 mb-20">
            {/* Sticky Header Section */}
            <div className="sticky top-[104px] z-[30] glass-header py-6 px-4 -mx-4 flex flex-col md:flex-row justify-between items-center gap-6 transition-all duration-300">
                <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight text-shadow-sm">Library Collection</h3>
                    <p className="text-sm text-slate-400 mt-2 font-medium italic">"{books?.length || 0} curated masterpieces found in the database."</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold shadow-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 outline-none transition-all placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        disabled={createMutation.isPending}
                        className="w-full md:w-auto px-6 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 active:scale-95 disabled:opacity-50 group"
                    >
                        {createMutation.isPending ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />}
                        Add Books
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto relative">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 z-[21] bg-white/95 backdrop-blur-sm shadow-sm">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id} className="border-b border-slate-100">
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className={`px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors ${header.column.getCanSort() ? 'cursor-pointer hover:text-primary-600 select-none' : ''
                                                } ${header.id === 'actions' ? 'text-right sticky right-0 bg-white/95 backdrop-blur-sm z-[22]' :
                                                    header.id === 'properties' ? 'text-center' : ''
                                                }`}
                                        >
                                            <div className={`flex items-center gap-2 ${header.id === 'actions' ? 'justify-end' : header.id === 'properties' ? 'justify-center' : ''}`}>
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
                                            className={`px-10 py-8 ${cell.column.id === 'actions' ? 'text-right sticky right-0 bg-white/60 backdrop-blur-md z-[20] shadow-[-20px_0_30px_-15px_rgba(0,0,0,0.05)] group-hover:bg-slate-50/90 transition-all' : ''
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

            <BookModal
                key={editingBook ? `edit-${editingBook.id}` : 'create'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                book={editingBook}
                isEdit={!!editingBook}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />
        </div>
    );
};

export default Books;
