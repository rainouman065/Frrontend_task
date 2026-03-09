import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { endpoints, useApiMutation, useApiQuery } from '../api';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Swal from 'sweetalert2';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    myProducts,
    setMyProducts,
    productOverrides,
    setProductOverrides,
    deletedProductIds,
    setDeletedProductIds,
  } = useData();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  // Categories query
  const { data: categories = [] } = useApiQuery({
    queryKey: ['categories'],
    url: endpoints.categories,
    select: (data) => (Array.isArray(data) ? data : []),
  });

  // Product query
  const isDeleted = deletedProductIds.map(String).includes(String(id));
  const localProduct = myProducts.find(p => String(p.id) === String(id));
  const isLocal = !!localProduct;

  const { data: apiProductData, error: apiProductError } = useApiQuery({
    queryKey: ['product', id],
    url: endpoints.product(id),
    enabled: !!id && !isDeleted && !isLocal,
  });

  const error = isDeleted ? 'This product is deleted.' : apiProductError?.message;

  // Compute product state
  const product = React.useMemo(() => {
    if (isDeleted) return null;
    if (isLocal) return localProduct;
    if (apiProductData) {
      const ov = productOverrides[String(id)];
      return ov ? { ...apiProductData, ...ov } : apiProductData;
    }
    return null;
  }, [id, isDeleted, isLocal, localProduct, apiProductData, productOverrides]);

  // Synchronize edit fields when product changes
  React.useEffect(() => {
    if (product && !isEditing) {
      setEditTitle(product.title);
      setEditPrice(String(product.price));
      setEditDescription(product.description || '');
      setEditCategoryId(product.category?.id ? String(product.category.id) : '');
      setEditImageUrl(product.images?.[0] ? String(product.images[0]) : '');
    }
  }, [product, isEditing]);

  // Related products query
  const { data: related = [] } = useApiQuery({
    queryKey: ['product-related', id],
    url: endpoints.productRelated(id),
    select: (data) => {
      const list = Array.isArray(data) ? data : [];
      return list.slice(0, 4);
    },
    enabled: !!id && !isLocal,
  });

  const updateProductMutation = useApiMutation({
    method: 'put',
    url: () => endpoints.product(id),
    invalidateKeys: [['products'], ['product', id]],
  });

  const deleteProductMutation = useApiMutation({
    method: 'delete',
    url: () => endpoints.product(id),
    invalidateKeys: [['products'], ['product', id]],
  });

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!product) return;

    var selectedCategory =
      categories.find(function (c) {
        return String(c.id) === String(editCategoryId);
      }) || product.category;

    var finalImage =
      (editImageUrl && editImageUrl.trim()) ||
      (product.images && product.images[0] ? String(product.images[0]) : 'https://via.placeholder.com/600');

    var updated = {
      ...product,
      title: editTitle.trim(),
      price: Number(editPrice) || 0,
      description: (editDescription && editDescription.trim()) || product.description || 'No description.',
      category: selectedCategory || product.category,
      images: [finalImage],
      updatedAt: new Date().toISOString(),
    };

    // 1) Agar local product hai to state me update
    if (product.isLocal) {
      setMyProducts(function (list) {
        var idx = list.findIndex(function (p) {
          return String(p.id) === String(id);
        });
        if (idx === -1) return list;
        var next = [...list];
        next[idx] = updated;
        return next;
      });
    } else {
      // 2) API product hai to override state me update
      setProductOverrides(function (prev) {
        return {
          ...prev,
          [String(id)]: {
            title: updated.title,
            price: updated.price,
            description: updated.description,
            category: updated.category,
            images: updated.images,
          },
        };
      });
    }

    try {
      await updateProductMutation.mutateAsync({
        title: updated.title,
        price: updated.price,
        description: updated.description,
        categoryId: updated.category?.id,
        images: updated.images,
      });
    } catch (err) {
      console.error('Failed to update product via API:', err);
    }

    setIsEditing(false);
    Swal.fire({
      icon: 'success',
      title: 'Updated',
      text: 'Product updated successfully.',
      timer: 1500,
      showConfirmButton: false,
    });
  }

  function handleDelete() {
    if (!product) return;

    Swal.fire({
      title: 'Delete product?',
      text: 'This cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      customClass: {
        actions: 'flex justify-end gap-2 mt-4',
        confirmButton: 'bg-[#e11d48] text-white px-4 py-2 rounded-lg no-hover',
        cancelButton: 'bg-[#9ca3af] text-white px-4 py-2 rounded-lg no-hover',
      },
      buttonsStyling: false, // important: taake SweetAlert ka default style na lage
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        await deleteProductMutation.mutateAsync();
      } catch (err) {
        console.error('Failed to delete product via API:', err);
      }

      // Local product: state se remove
      if (product.isLocal) {
        setMyProducts(function (list) {
          return list.filter(function (p) {
            return String(p.id) !== String(id);
          });
        });
      } else {
        // API product: deleted list me add karo + override remove
        setDeletedProductIds(function (prev) {
          if (prev.indexOf(String(id)) !== -1) return prev;
          return [...prev, String(id)];
        });
        setProductOverrides(function (prev) {
          var next = { ...prev };
          delete next[String(id)];
          return next;
        });
      }

      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Product deleted successfully.',
        timer: 1500,
        showConfirmButton: false,
      });

      navigate('/products', { replace: true });
    });
  }

  // Error dikhao agar product mila hi nahi
  if (error && !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">{error}</p>
          <Link to="/products" className="inline-block mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const img = product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/600';
  const categoryName = product.category && product.category.name ? product.category.name : 'Uncategorized';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/products" className="text-slate-600 hover:text-amber-600 mb-6 inline-block font-medium">
        ← Back to Products
      </Link>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden md:flex">
        <div className="md:w-1/2 aspect-square bg-slate-100">
          <img src={img} alt={product.title} className="w-full h-full object-cover" />
        </div>
        <div className="md:w-1/2 p-8">
          <span className="text-sm font-medium text-amber-600 uppercase">{categoryName}</span>
          <h1 className="text-3xl font-bold text-slate-800 mt-2">{product.title}</h1>
          <p className="text-4xl font-bold text-amber-600 mt-4">${product.price}</p>
          {isAuthenticated && (
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={function () {
                  setIsEditing(true);
                }}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg font-medium"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium"
              >
                Delete
              </button>
            </div>
          )}
          <p className="mt-6 text-slate-600">{product.description || 'No description.'}</p>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Related products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map(function (item) {
              const itemImg = item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/400';
              return (
                <Link
                  key={item.id}
                  to={'/product/' + item.id}
                  className="bg-white rounded-xl shadow border overflow-hidden hover:shadow-lg"
                >
                  <div className="aspect-square bg-slate-100">
                    <img src={itemImg} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-slate-800 line-clamp-2 text-sm">{item.title}</h3>
                    <p className="text-amber-600 font-bold mt-1">${item.price}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Edit modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Edit product</h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={function (e) {
                    setEditTitle(e.target.value);
                  }}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                <input
                  type="number"
                  min="0"
                  value={editPrice}
                  onChange={function (e) {
                    setEditPrice(e.target.value);
                  }}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={function (e) {
                    setEditDescription(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={editCategoryId}
                  onChange={function (e) {
                    setEditCategoryId(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                >
                  {product.category && (
                    <option value={product.category.id || ''}>
                      {product.category.name || 'Current category'}
                    </option>
                  )}
                  {categories
                    .filter(function (cat) {
                      if (!product.category) return true;
                      return String(cat.id) !== String(product.category.id);
                    })
                    .map(function (cat) {
                      return (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={editImageUrl}
                  onChange={function (e) {
                    setEditImageUrl(e.target.value);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={function () {
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
