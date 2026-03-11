import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getFilteredRowModel,
    getSortedRowModel,
} from '@tanstack/react-table';
import { fetchUsers, createUser, updateUser, deleteUser } from '../api';
import { User, Shield, Key, Loader2, AlertCircle, CheckCircle2, MoreHorizontal, Plus, Search, Edit3, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import UserModal from '../components/UserModal';
import Swal from 'sweetalert2';

const Users = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [sorting, setSorting] = useState([]);

    const { data: users = [], isLoading, isError, error } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });

    const createMutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setIsModalOpen(false);
            Swal.fire({
                icon: 'success',
                title: 'User Onboarded!',
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setIsModalOpen(false);
            Swal.fire({
                icon: 'success',
                title: 'Profile Synchronized!',
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            Swal.fire({
                icon: 'success',
                title: 'Identity Purged!',
            });
        }
    });

    const handleCreate = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Delete User?',
            text: "This action will permanently purge the user identity!",
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

    const handleSubmit = (formData) => {
        if (editingUser) {
            updateMutation.mutate({ ...formData, id: editingUser.id });
        } else {
            createMutation.mutate(formData);
        }
    };

    // TanStack Table Column Definitions
    const columns = useMemo(() => [
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
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => handleEdit(user)}
                            className="p-3 bg-white hover:bg-slate-900 text-slate-400 hover:text-white rounded-2xl transition-all border border-slate-100 hover:border-slate-800 shadow-sm"
                        >
                            <Edit3 size={18} />
                        </button>
                        <button 
                            onClick={() => handleDelete(user.id)}
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
        data: users,
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
                <p className="text-slate-500 font-medium animate-pulse tracking-[0.2em] uppercase text-[10px]">Accessing Mainframe...</p>
            </div>
        );
    }

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
            <div className="sticky top-[104px] z-[30] glass-header py-6 px-4 -mx-4 flex flex-col md:flex-row justify-between items-center gap-6 transition-all duration-300">
                <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">Active Users</h3>
                    <p className="text-sm text-slate-400 mt-2 font-medium">Manage and monitor system users and their permissions.</p>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Filter identities..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold shadow-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 outline-none transition-all placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={handleCreate}
                        className="w-full md:w-auto px-6 py-4 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary-600/20 hover:bg-primary-700 transition-all flex items-center justify-center gap-2 group active:scale-95"
                    >
                        <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                        Add New User
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
                            <tr key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                                {row.getVisibleCells().map(cell => (
                                    <td 
                                        key={cell.id} 
                                        className={`px-10 py-6 ${
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
