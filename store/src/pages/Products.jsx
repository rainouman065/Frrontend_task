import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { endpoints, useApiQuery } from '../api';
import { useData } from '../context/DataContext';
import AddProductForm from '../components/AddProductForm';
import LoadingSpinner from '../components/LoadingSpinner';

const PAGE_SIZE = 12;

function Products() {
  const {
    myProducts,
    productOverrides,
    deletedProductIds,
    myCategories,
    categoryOverrides,
    deletedCategoryIds,
  } = useData();

  const [page, setPage] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter inputs
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  // Applied filters
  const [appliedTitle, setAppliedTitle] = useState('');
  const [appliedCategory, setAppliedCategory] = useState('');
  const [appliedMinPrice, setAppliedMinPrice] = useState('');
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('');

  const hasFilters =
    !!appliedTitle || !!appliedCategory || !!appliedMinPrice || !!appliedMaxPrice;

  // Categories fetch using React Query
  const { data: fetchedCategories = [] } = useApiQuery({
    queryKey: ['categories'],
    url: endpoints.categories,
    select: (data) => (Array.isArray(data) ? data : []),
  });

  const categories = useMemo(() => {
    const deletedIds = deletedCategoryIds.map(String);
    const apiCats = fetchedCategories
      .filter(c => !deletedIds.includes(String(c.id)))
      .map(c => ({ ...c, ...(categoryOverrides[String(c.id)] || {}) }));

    return [...myCategories, ...apiCats];
  }, [fetchedCategories, myCategories, categoryOverrides, deletedCategoryIds]);

  // Fetch products using React Query
  let productsUrl = endpoints.products;
  if (!hasFilters) productsUrl += `?limit=${PAGE_SIZE}&offset=${page * PAGE_SIZE}`;

  const { data: fetchedProducts = [], isLoading: loading, error: queryError } = useApiQuery({
    queryKey: ['products', page, hasFilters],
    url: productsUrl,
    select: (data) => (Array.isArray(data) ? data : []),
  });

  const products = useMemo(() => {
    // Filtering function moved inside to avoid missing dependency
    const localMatchesFilters = p => {
      const title = (p.title || '').toLowerCase().trim();
      const filterTitle = (appliedTitle || '').toLowerCase().trim();
      if (filterTitle && !title.includes(filterTitle)) return false;

      if (appliedCategory) {
        const categoryId = p.category?.id?.toString() || '';
        if (categoryId !== appliedCategory.toString()) return false;
      }

      const price = Number(p.price) || 0;
      if (appliedMinPrice && price < Number(appliedMinPrice)) return false;
      if (appliedMaxPrice && price > Number(appliedMaxPrice)) return false;

      return true;
    };

    const deletedIds = deletedProductIds.map(String);
    const apiList = fetchedProducts
      .filter(p => !deletedIds.includes(String(p.id)))
      .map(p => ({ ...p, ...(productOverrides[String(p.id)] || {}) }));

    const localFiltered = myProducts.filter(localMatchesFilters);
    const apiFiltered = apiList.filter(localMatchesFilters);

    return [...localFiltered, ...apiFiltered];
  }, [
    fetchedProducts,
    myProducts,
    productOverrides,
    deletedProductIds,
    appliedTitle,
    appliedCategory,
    appliedMinPrice,
    appliedMaxPrice,
  ]);

  const hasMore = !hasFilters && fetchedProducts.length === PAGE_SIZE;
  const error = queryError?.message;

  const applyFilter = () => {
    setAppliedTitle(searchTitle);
    setAppliedCategory(selectedCategory);
    setAppliedMinPrice(minPrice);
    setAppliedMaxPrice(maxPrice);
    setPage(0);
  };

  const clearFilter = () => {
    setSearchTitle('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setAppliedTitle('');
    setAppliedCategory('');
    setAppliedMinPrice('');
    setAppliedMaxPrice('');
    setPage(0);
  };

  // NEW: Add product directly to state without full refresh
  const handleProductCreated = () => {
    setShowAddModal(false);
  };

  if (error)
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Try again
          </button>
        </div>
      </div>
    );

  if (loading) return <LoadingSpinner fullScreen text="Loading products..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">All Products</h1>
        <div className="flex gap-2 flex-wrap justify-end">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white font-medium hover:bg-amber-600"
          >
            Add Product
          </button>

        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow border border-slate-100 p-4 mb-8">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">Filter</h2>
        <form
          className="flex flex-wrap gap-3 items-end"
          onSubmit={e => { e.preventDefault(); applyFilter(); }}
        >
          <div className="min-w-[180px]">
            <label className="block text-xs text-slate-500 mb-1">Title</label>
            <input
              type="text"
              value={searchTitle}
              onChange={e => setSearchTitle(e.target.value)}
              placeholder="Search by title"
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>
          <div className="min-w-[140px]">
            <label className="block text-xs text-slate-500 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-56 px-3 py-2 rounded-lg border border-slate-300"
            >
              <option value="">All</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-24">
            <label className="block text-xs text-slate-500 mb-1">Min price</label>
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>
          <div className="w-24">
            <label className="block text-xs text-slate-500 mb-1">Max price</label>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              placeholder="Max"
              className="w-full px-3 py-2 rounded-lg border border-slate-300"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-amber-500 text-slate-900 font-medium"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={clearFilter}
            className="px-4 py-2 rounded-lg border border-slate-300"
          >
            Clear
          </button>
        </form>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => {
          const img = product.images?.[0] || 'https://via.placeholder.com/400';
          return (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden hover:shadow-lg flex flex-col"
            >
              {/* Image container */}
              <div className="w-full h-60 bg-slate-100 flex-shrink-0">
                <img
                  src={img}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product info */}
              <div className="p-4 flex-1 flex flex-col">
                {/* Title */}
                <h2 className="font-semibold text-slate-800 line-clamp-2">
                  {product.title}
                </h2>

                {/* Spacer pushes bottom elements down */}
                <div className="mt-auto">
                  <p className="text-xl font-bold text-amber-600">
                    ${product.price}
                  </p>
                  <Link
                    to={'/product/' + product.id}
                    className="mt-2 block w-full text-center py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-amber-600"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {!hasFilters && (
        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 0))}
            disabled={page === 0}
            className="px-4 py-2 rounded-lg bg-slate-200 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-slate-600">Page {page + 1}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!hasMore}
            className="px-4 py-2 rounded-lg bg-slate-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-3 relative">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-base"
            >
              ×
            </button>
            <h2 className="text-md font-medium text-slate-800 mb-2">Add product</h2>
            <AddProductForm onCreated={handleProductCreated} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;