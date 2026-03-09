import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { endpoints, useApiMutation, useApiQuery } from '../api';
import { useData } from '../context/DataContext';
import LoadingSpinner from '../components/LoadingSpinner';
 
function Categories() {
  const navigate = useNavigate();

  const {
    myCategories,
    setMyCategories,
    categoryOverrides,
    setCategoryOverrides,
    deletedCategoryIds,
    setDeletedCategoryIds,
    nextLocalCategoryId,
    setNextLocalCategoryId,
  } = useData();

  // Dialog states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState('');

  // Server state query
  const { data: apiCategoriesRaw, isLoading: loading } = useApiQuery({
    queryKey: ['categories'],
    url: endpoints.categories,
  });
  const apiCategories = Array.isArray(apiCategoriesRaw) ? apiCategoriesRaw : [];

  const addCategoryMutation = useApiMutation({
    method: 'post',
    url: endpoints.categories,
    body: { name, image },
    invalidateKeys: [['categories']],
  });

  const updateCategoryMutation = useApiMutation({
    method: 'put',
    url: (vars) => `${endpoints.categories}/${vars.id}`,
    body: ({ id, ...rest }) => rest,
    invalidateKeys: [['categories']],
  });

  const deleteCategoryMutation = useApiMutation({
    method: 'delete',
    url: (vars) => `${endpoints.categories}/${vars.id}`,
    invalidateKeys: [['categories']],
  });

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  // Combined data
  const categories = useMemo(() => {
    var deletedIds = deletedCategoryIds.map(String);
    var apiCats = apiCategories
      .filter(c => deletedIds.indexOf(String(c.id)) === -1)
      .map(c => {
        var ov = categoryOverrides[String(c.id)];
        if (!ov) return c;
        return { ...c, ...ov };
      });
    return [...myCategories, ...apiCats];
  }, [apiCategories, myCategories, categoryOverrides, deletedCategoryIds]);


  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    var nextId = nextLocalCategoryId;
    setNextLocalCategoryId(nextId + 1);

    var newCat = {
      id: nextId,
      name: name.trim(),
      slug: slugify(name),
      image: image.trim() || 'https://placehold.co/600x400',
      isLocal: true,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await addCategoryMutation.mutateAsync();
      if (response && response.id) {
        newCat.id = response.id;
        newCat.isLocal = false;
      }
    } catch (err) {
      console.error('Failed to add category via API:', err);
    }

    setMyCategories(prev => [newCat, ...prev]);
    setName('');
    setImage('');
    setIsAddModalOpen(false);

    Swal.fire({
      icon: 'success',
      title: 'Added',
      text: 'Category was added.',
      timer: 1500,
      showConfirmButton: false,
    });
  }

  function openEdit(cat) {
    setEditId(String(cat.id));
    setEditName(cat.name || '');
    setEditImage(cat.image || '');
    setIsEditing(true);
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!editName.trim()) return;

    var id = String(editId);
    var idx = myCategories.findIndex(c => String(c.id) === id);

    if (idx !== -1) {
      setMyCategories(prev => {
        var next = [...prev];
        next[idx] = {
          ...next[idx],
          name: editName.trim(),
          slug: slugify(editName),
          image: editImage.trim() || 'https://placehold.co/600x400',
          updatedAt: new Date().toISOString(),
        };
        return next;
      });
    } else {
      setCategoryOverrides(prev => ({
        ...prev,
        [id]: {
          name: editName.trim(),
          slug: slugify(editName),
          image: editImage.trim() || 'https://placehold.co/600x400',
        },
      }));
    }

    try {
      await updateCategoryMutation.mutateAsync({
        id,
        name: editName.trim(),
        image: editImage.trim() || 'https://placehold.co/600x400',
      });
    } catch (err) {
      console.error('Failed to update category via API:', err);
    }

    setIsEditing(false);
    Swal.fire({ icon: 'success', title: 'Updated', timer: 1500, showConfirmButton: false });
  }

  function handleDelete(cat) {
    var id = String(cat.id);
    Swal.fire({
      title: 'Delete category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      customClass: {
        actions: 'flex justify-end gap-2 mt-4',
        confirmButton: 'bg-[#e11d48] text-white px-4 py-2 rounded-lg no-hover',
        cancelButton: 'bg-[#9ca3af] text-white px-4 py-2 rounded-lg no-hover',
      },
      buttonsStyling: false,
    }).then(async result => {
      if (!result.isConfirmed) return;

      try {
        await deleteCategoryMutation.mutateAsync({ id });
      } catch (err) {
        console.error('Failed to delete category via API:', err);
      }

      if (cat.isLocal) {
        setMyCategories(prev => prev.filter(c => String(c.id) !== id));
      } else {
        setDeletedCategoryIds(prev => prev.indexOf(id) === -1 ? [...prev, id] : prev);
        setCategoryOverrides(prev => {
          var next = { ...prev };
          delete next[id];
          return next;
        });
      }

      Swal.fire({ icon: 'success', title: 'Deleted', timer: 1500, showConfirmButton: false });
    });
  }

  // --- Fully Controlled TanStack Table Setup ---
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: info => (
        <span className="px-4 py-2 text-sm text-slate-700">{info.getValue()}</span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: info => (
        <span className="px-4 py-2 text-sm font-semibold text-slate-800">{info.getValue()}</span>
      ),
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: info => (
        <span className="px-4 py-2 text-sm text-slate-500">{info.getValue()}</span>
      ),
    },
    {
      accessorKey: 'image',
      header: 'Image',
      enableSorting: false,
      cell: info => (
        <img
          src={info.getValue() || 'https://placehold.co/60x60'}
          alt={info.row.original.name}
          className="w-12 h-12 rounded object-cover border border-slate-200"
        />
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: info => (
        <div className="flex gap-2 px-4 py-2">
          <button
            onClick={() => openEdit(info.row.original)}
            className="px-3 py-1.5 bg-slate-800 text-white rounded text-xs font-medium hover:bg-slate-700 transition"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(info.row.original)}
            className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data: categories,
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
    return <LoadingSpinner fullScreen text="Loading categories..." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header section */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Categories</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-black text-white font-medium hover:bg-amber-600 shadow-sm transition"
          >
            + Add Category
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 hover:bg-slate-50 shadow-sm transition"
          >
            Back
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-200">{error}</div>}

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
              placeholder="Search all columns..."
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">Rows per page:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition shadow-sm"
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
          <table className="w-full text-left border-collapse">
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
                              ? 'cursor-pointer select-none flex items-center gap-2 hover:text-slate-900'
                              : 'flex items-center gap-2',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <span className="text-amber-600 ml-1">▲</span>,
                            desc: <span className="text-amber-600 ml-1">▼</span>,
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
                    No categories found.
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
              className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              {'<<'}
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 hover:text-slate-900 transition-colors"
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
              className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              {'>'}
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              {'>>'}
            </button>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Add Category</h2>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium text-slate-900"
                  placeholder="e.g. Electronics"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Image URL</label>
                <input
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium text-slate-900"
                  placeholder="https://..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors border border-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 shadow-sm transition-colors"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Edit Category</h2>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Name</label>
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Image URL</label>
                <input
                  value={editImage}
                  onChange={e => setEditImage(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium text-slate-900"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors border border-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 shadow-sm transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;