import { Method } from 'axios';
import { UseMutationOptions } from '@tanstack/react-query';
import { Table } from '@tanstack/react-table';

export interface Book {
    id: number;
    title: string;
    description: string;
    pageCount: number;
    excerpt: string;
    publishDate: string;
}

export interface Author {
    id: number;
    idBook: number;
    firstName: string;
    lastName: string;
}

export interface User {
    id: number;
    userName: string;
    password?: string;
}

export interface Activity {
    id: number;
    title: string;
    dueDate: string;
    completed: boolean;
}

export interface Photo {
    id: number;
    idBook: number;
    url: string;
}

// --- API & Mutation Types ---

export interface RequestArgs {
    url: string;
    method?: Method;
    data?: any;
    params?: any;
    headers?: any;
}

export interface CommonMutationOptions<TData, TVariables, TContext>
    extends Omit<UseMutationOptions<TData, Error, TVariables, TContext>, 'mutationFn'> {
    queryKeyToInvalidate?: any[];
}

// --- Component Prop Types ---

export interface BaseModalProps<T> {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<T>) => void;
    isEdit: boolean;
    isLoading: boolean;
}

export interface PageHeaderProps {
    title: string;
    subtitle?: string;
    searchValue: string;
    onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchPlaceholder?: string;
    onAdd: () => void;
    addLabel?: string;
    isAdding?: boolean;
}

export interface DataTableProps<T> {
    table: Table<T>;
    centeredColumns?: string[];
}

export interface RowActionsProps {
    onEdit: () => void;
    onDelete: () => void;
}

export interface TablePaginationProps<T> {
    table: Table<T>;
}
