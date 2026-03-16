import React, { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
} from '@tanstack/react-table';
import { request, useCommonMutation } from '../api/api';
import { AlertCircle, CheckCircle2, Key } from 'lucide-react';
import UserModal from '../components/UserModal';
import PageHeader from '../components/PageHeader';
import { CustomSwal, DangerSwal } from '../utils/swal';
import LoadingSpinner from '../components/LoadingSpinner';
import DataTable from '../components/DataTable';
import RowActions from '../components/RowActions';
import { User } from '../types';
import { ColumnDef, SortingState, PaginationState } from '@tanstack/react-table';


const Users = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data: users = [], isLoading, isError, error } = useQuery<User[], Error>({
        queryKey: ['users'],
        queryFn: () => request({ url: '/Users', method: 'GET' }),
    });

    const createMutation = useCommonMutation<User, Partial<User>>('/Users', 'POST', {
        onSuccess: (createdUser, variables) => {
            const nextUser = createdUser && typeof createdUser === 'object' ? createdUser : variables as User;
            queryClient.setQueryData(['users'], (oldUsers: User[] | undefined) => {
                const list = oldUsers || [];
                const hasId = nextUser?.id !== undefined && nextUser?.id !== null;
                const maxId = list.reduce((m, u) => (typeof u?.id === 'number' ? Math.max(m, u.id) : m), 0);
                const withId = hasId ? nextUser : { ...nextUser, id: maxId + 1 } as User;
                return [withId, ...list];
            });
            setIsModalOpen(false);
            CustomSwal.fire({
                icon: 'success',
                title: 'User Onboarded!',
            });
        }
    });

    const updateMutation = useCommonMutation<User, Partial<User>>((data) => `/Users/${data.id}`, 'PUT', {
        onSuccess: (updatedUser, variables) => {
            const nextUser = updatedUser && typeof updatedUser === 'object' ? updatedUser : variables as User;
            queryClient.setQueryData(['users'], (oldUsers: User[] | undefined) =>
                (oldUsers || []).map(u => u.id === nextUser.id ? { ...u, ...nextUser } as User : u)
            );
            setIsModalOpen(false);
            CustomSwal.fire({
                icon: 'success',
                title: 'Profile Synchronized!',
            });
        }
    });

    const deleteMutation = useCommonMutation<any, number>((id) => `/Users/${id}`, 'DELETE', {
        onSuccess: (_, deletedId) => {
            const deleted = Number(deletedId);
            queryClient.setQueryData(['users'], (oldUsers: User[] | undefined) =>
                (oldUsers || []).filter(u => Number(u.id) !== deleted)
            );
            CustomSwal.fire({
                icon: 'success',
                title: 'Identity Purged!',
            });
        }
    });

    const handleCreate = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        DangerSwal.fire({
            title: 'Delete User?',
            text: "This action will permanently purge the user identity!",
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

    const handleSubmit = (formData: Partial<User>) => {
        if (editingUser) {
            updateMutation.mutate({ ...formData, id: editingUser.id });
        } else {
            createMutation.mutate(formData);
        }
    };

    // TanStack Table Column Definitions
    const columns = useMemo<ColumnDef<User>[]>(() => [
        {
            header: 'User Details',
            accessorKey: 'userName',
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-primary-600 font-black text-xl border border-indigo-100 group-hover:scale-110 group-hover:bg-primary-50 group-hover:border-primary-200 transition-all duration-300">
                            {user.userName[0].toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-slate-800 group-hover:text-primary-600 transition-colors tracking-tight text-lg">{user.userName}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">MEMBER ID: #{user.id}</span>
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Credentials',
            accessorKey: 'password',
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Key size={14} className="text-primary-500" />
                            <span className="font-mono text-[10px] p-2 bg-slate-50 rounded-xl select-all border border-slate-100 tracking-tighter font-bold text-slate-500 hover:text-primary-600 hover:border-primary-200 transition-all cursor-help" title="Password from API">
                                {user.password}
                            </span>
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
                    <span className="flex items-center gap-2 px-4 py-1.5 bg-accent-50 text-accent-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-accent-100 shadow-sm">
                        <CheckCircle2 size={12} />
                        Verified
                    </span>
                </div>
            )
        },
        {
            header: 'Actions',
            id: 'actions',
            enableSorting: false,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <RowActions
                        onEdit={() => handleEdit(user)}
                        onDelete={() => handleDelete(user.id)}
                    />
                );
            }
        }
    ], []);

    const table = useReactTable({
        data: users,
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

    if (isLoading) return <LoadingSpinner message="Accessing Mainframe..." />;

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-red-500 gap-4">
                <AlertCircle size={48} />
                <h3 className="text-xl font-bold">Failed to load users</h3>
                <p className="text-slate-500">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 mb-20">
            {/* Sticky Header Section */}
            <PageHeader
                title="Active Users"
                subtitle="Manage and monitor system users and their permissions."
                searchValue={searchTerm}
                onSearch={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                searchPlaceholder="Filter identities..."
                onAdd={handleCreate}
                addLabel="Add New User"
            />

            <DataTable table={table} centeredColumns={['status']} />

            <UserModal
                key={editingUser ? `edit-${editingUser.id}` : 'create'}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                user={editingUser}
                isEdit={!!editingUser}
                isLoading={createMutation.isPending || updateMutation.isPending}
            />
        </div>
    );
};

export default Users;
