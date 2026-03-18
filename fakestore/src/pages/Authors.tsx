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
import { Star } from 'lucide-react';
import AuthorModal from '../components/AuthorModal';
import PageHeader from '../components/PageHeader';
import { CustomSwal, DangerSwal } from '../utils/swal';
import LoadingSpinner from '../components/LoadingSpinner';
import DataTable from '../components/DataTable';
import RowActions from '../components/RowActions';
import { Author } from '../types';
import { ColumnDef, SortingState, PaginationState } from '@tanstack/react-table';


import { useModal } from '../context/ModalContext';

const Authors = () => {
    const queryClient = useQueryClient();
    const { showModal, hideModal } = useModal();
    const [searchTerm, setSearchTerm] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data: authors = [], isLoading } = useQuery<Author[], Error>({
        queryKey: ['authors'],
        queryFn: () => request({ url: '/Authors', method: 'GET' }),
    });

    const createMutation = useCommonMutation<Author, Partial<Author>>('/Authors', 'POST', {
        onSuccess: (createdAuthor, variables) => {
            const nextAuthor = createdAuthor && typeof createdAuthor === 'object' ? createdAuthor : variables as Author;
            queryClient.setQueryData(['authors'], (old: Author[] | undefined) => {
                const list = old || [];
                const hasId = nextAuthor?.id !== undefined && nextAuthor?.id !== null;
                const maxId = list.reduce((m, a) => (typeof a?.id === 'number' ? Math.max(m, a.id) : m), 0);
                const withId = hasId ? nextAuthor : { ...nextAuthor, id: maxId + 1 } as Author;
                return [withId, ...list];
            });
            hideModal();
            CustomSwal.fire({
                icon: 'success',
                title: 'Author Onboarded (Local)',
                text: 'The database has been updated for this session.',
            });
        },
        onError: (err) => {
            CustomSwal.fire({ icon: 'error', title: 'Add failed', text: err.message });
        }
    });

    const updateMutation = useCommonMutation<Author, Partial<Author>>((data) => `/Authors/${data.id}`, 'PUT', {
        onSuccess: (_updatedAuthor, variables) => {
            queryClient.setQueryData(['authors'], (old: Author[] | undefined) =>
                (old || []).map(a => a.id === variables.id ? { ...a, ...variables } as Author : a)
            );
            hideModal();
            CustomSwal.fire({
                icon: 'success',
                title: 'Author Records Updated',
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

    const deleteMutation = useCommonMutation<any, number>((id) => `/Authors/${id}`, 'DELETE', {
        onSuccess: (_, deletedId) => {
            const deleted = Number(deletedId);
            queryClient.setQueryData(['authors'], (old: Author[] | undefined) =>
                (old || []).filter(a => Number(a.id) !== deleted)
            );
            CustomSwal.fire({
                icon: 'success',
                title: 'Author Entity Deleted',
            });
        },
        onError: (err) => {
            CustomSwal.fire({ icon: 'error', title: 'Delete failed', text: err.message });
        }
    });

    const handleDelete = (id: number) => {
        DangerSwal.fire({
            title: 'Delete Author?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(Number(id));
            }
        });
    };

    const handleEdit = (author: Author) => {
        showModal(
            <AuthorModal
                isOpen={true}
                onClose={hideModal}
                onSubmit={(formData) => updateMutation.mutate({ ...formData, id: author.id })}
                author={author}
                isEdit={true}
                isLoading={updateMutation.isPending}
            />
        );
    };

    const handleCreate = () => {
        showModal(
            <AuthorModal
                isOpen={true}
                onClose={hideModal}
                onSubmit={(formData) => createMutation.mutate(formData)}
                isEdit={false}
                author={null}
                isLoading={createMutation.isPending}
            />
        );
    };

    // TanStack Table Column Definitions
    const columns = useMemo<ColumnDef<Author>[]>(() => [
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
                    <RowActions
                        onEdit={() => handleEdit(author)}
                        onDelete={() => handleDelete(author.id)}
                    />
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

    if (isLoading) return <LoadingSpinner message="Accessing Database..." />;

    return (
        <div className="space-y-8 mb-20">
            {/* Sticky Header Section */}
            <PageHeader
                title="Global Creators"
                subtitle={`"Managing a database of ${authors.length} elite literary figures."`}
                searchValue={searchTerm}
                onSearch={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                searchPlaceholder="Search contributors..."
                onAdd={handleCreate}
                addLabel="Add Author"
            />

            <DataTable table={table} centeredColumns={['status']} />
        </div>
    );
};

export default Authors;
