import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
} from '@tanstack/react-table';
import { request, useCommonMutation } from '../api/api';
import { BookOpen, Calendar, Hash } from 'lucide-react';
import BookModal from '../components/BookModal';
import PageHeader from '../components/PageHeader';
import { CustomSwal, DangerSwal } from '../utils/swal';
import LoadingSpinner from '../components/LoadingSpinner';
import DataTable from '../components/DataTable';
import RowActions from '../components/RowActions';
import { Book } from '../types';
import { ColumnDef, SortingState, PaginationState } from '@tanstack/react-table';


import { useModal } from '../context/ModalContext';

const Books = () => {
    const queryClient = useQueryClient();
    const { showModal, hideModal } = useModal();
    const [searchTerm, setSearchTerm] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data: books = [], isLoading } = useQuery<Book[], Error>({
        queryKey: ['books'],
        queryFn: () => request({ url: '/Books', method: 'GET' }),
    });

    // Mutations
    const createMutation = useCommonMutation<Book, Partial<Book>>('/Books', 'POST', {
        onSuccess: (createdBook, variables) => {
            const nextBook = createdBook && typeof createdBook === 'object' ? createdBook : variables as Book;
            queryClient.setQueryData(['books'], (oldBooks: Book[] | undefined) => {
                const list = oldBooks || [];
                const hasId = nextBook?.id !== undefined && nextBook?.id !== null;
                const maxId = list.reduce((m, b) => (typeof b?.id === 'number' ? Math.max(m, b.id) : m), 0);
                const withId = hasId ? nextBook : { ...nextBook, id: maxId + 1 } as Book;
                return [withId, ...list];
            });
            hideModal();
            CustomSwal.fire({
                icon: 'success',
                title: 'Book Added',
            });
        },
        onError: (err: any) => {
            CustomSwal.fire({
                icon: 'error',
                title: 'Failed to add',
                text: err.response?.data?.title || err.message,
            });
        }
    });

    const updateMutation = useCommonMutation<Book, Partial<Book>>((data) => `/Books/${data.id}`, 'PUT', {
        onSuccess: (updatedBook, variables) => {
            const nextBook = updatedBook && typeof updatedBook === 'object' ? updatedBook : variables as Book;
            queryClient.setQueryData(['books'], (oldBooks: Book[] | undefined) =>
                (oldBooks || []).map(b => b.id === nextBook.id ? { ...b, ...nextBook } as Book : b)
            );
            hideModal();
            CustomSwal.fire({
                icon: 'success',
                title: 'Book Updated locally',
            });
        },
        onError: (err: any) => {
            CustomSwal.fire({
                icon: 'error',
                title: 'Update failed',
                text: err.response?.data?.title || err.message,
            });
        }
    });

    const deleteMutation = useCommonMutation<any, number>((id) => `/Books/${id}`, 'DELETE', {
        onSuccess: (_, deletedId) => {
            const deleted = Number(deletedId);
            queryClient.setQueryData(['books'], (oldBooks: Book[] | undefined) =>
                (oldBooks || []).filter(b => Number(b.id) !== deleted)
            );
            CustomSwal.fire({
                icon: 'success',
                title: 'Deleted',
            });
        },
        onError: (err: any) => {
            CustomSwal.fire({ icon: 'error', title: 'Delete failed', text: err.message });
        }
    });

    const handleDelete = (id: number) => {
        DangerSwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            confirmButtonText: 'Delete',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(Number(id));
            }
        });
    };

    const handleEdit = (book: Book) => {
        showModal(
            <BookModal
                isOpen={true}
                onClose={hideModal}
                onSubmit={(formData) => updateMutation.mutate({ ...formData, id: book.id })}
                book={book}
                isEdit={true}
                isLoading={updateMutation.isPending}
            />
        );
    };

    const handleCreate = () => {
        showModal(
            <BookModal
                isOpen={true}
                onClose={hideModal}
                onSubmit={(formData) => createMutation.mutate(formData)}
                isEdit={false}
                isLoading={createMutation.isPending}
            />
        );
    };

    // TanStack Table Column Definitions
    const columns = useMemo<ColumnDef<Book>[]>(() => [
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
                    <RowActions
                        onEdit={() => handleEdit(book)}
                        onDelete={() => handleDelete(book.id)}
                    />
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
            pagination,
        },
        onGlobalFilterChange: setSearchTerm,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    if (isLoading) return <LoadingSpinner message="Accessing Library..." />;

    return (
        <div className="space-y-8 mb-20">
            {/* Sticky Header Section */}
            <PageHeader
                title="Library Collection"
                subtitle={`"${books?.length || 0} curated masterpieces found in the database."`}
                searchValue={searchTerm}
                onSearch={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                searchPlaceholder="Search inventory..."
                onAdd={handleCreate}
                addLabel="Add Books"
                isAdding={createMutation.isPending}
            />

            <DataTable table={table} centeredColumns={['properties']} />
        </div>
    );
};

export default Books;
