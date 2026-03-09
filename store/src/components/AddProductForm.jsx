import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { endpoints, useApiMutation, useApiQuery } from '../api';
import { useData } from '../context/DataContext';
import Swal from 'sweetalert2';

function AddProductForm({ onCreated }) {
  const navigate = useNavigate();
  const { setMyProducts } = useData();
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // ---------- Load Categories ----------
  const { data: categories = [], isError: isCategoriesError } = useApiQuery({
    queryKey: ['categories'],
    url: endpoints.categories,
    select: (data) => (Array.isArray(data) ? data : []),
  });

  const createProductMutation = useApiMutation({
    method: 'post',
    url: endpoints.products,
    invalidateKeys: [['products']],
  });

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategoryId(String(categories[0].id));
    }
  }, [categories, categoryId]);

  useEffect(() => {
    if (isCategoriesError && !error) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('Failed to load categories');
    }
  }, [isCategoriesError, error]);

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsDataURL(file);
    });
  }

  // ---------- Submit ----------
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const finalImageUrl = imageUrl.trim() || 'https://placehold.co/600x400';

    const selectedCat = categories.find(
      (c) => String(c.id) === String(categoryId)
    );

    async function saveProductNow(img) {
      const newProduct = {
        title: title.trim(),
        price: Number(price) || 0,
        description: description.trim() || 'No description',
        category: selectedCat || { id: 1, name: 'Category' },
        images: [img],
      };

      try {
        const response = await createProductMutation.mutateAsync({
          title: newProduct.title,
          price: newProduct.price,
          description: newProduct.description,
          categoryId: newProduct.category.id,
          images: newProduct.images,
        });

        if (response && response.id) {
          setMyProducts(prev => [{ ...newProduct, id: response.id, isLocal: false }, ...prev]);
        }

        Swal.fire({
          icon: 'success',
          title: 'Product added',
          text: 'Your product was added successfully.',
          timer: 1500,
          showConfirmButton: false,
        });

        if (onCreated) onCreated(response);
        else navigate('/product/' + response.id, { replace: true });

      } catch (err) {
        console.error('Failed to create product via API:', err);
        setError(err.message || 'Failed to create product');
        Swal.fire('Error', 'Could not save product', 'error');
      }
    }

    if (selectedFile) {
      // File size check (Optional but good: e.g. 2MB)
      if (selectedFile.size > 2 * 1024 * 1024) {
        setError('File is too large! Please select an image under 2MB.');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        // Upload to /files/upload
        const uploadRes = await api.request('post', endpoints.filesUpload, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (uploadRes && uploadRes.location) {
          saveProductNow(uploadRes.location);
        } else {
          throw new Error('Upload failed - No location returned');
        }
      } catch (err) {
        console.error('Upload Error:', err);
        setError('Image upload failed. Try a smaller file or URL.');
      }
    } else {
      saveProductNow(finalImageUrl);
    }
  }

  // ---------- UI ----------
  return (
    <div className="max-w-md mx-auto">
      {error && (
        <div className="mb-3 p-2 bg-red-50 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow space-y-3"
      >
        <h2 className="text-lg font-semibold text-center">Add Product</h2>

        {/* Title + Price in one row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-2 py-1.5 rounded border"
            />
          </div>

          <div>
            <label className="text-sm">Price</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full px-2 py-1.5 rounded border"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-sm">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="w-full px-2 py-1.5 rounded border"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL"
            className="px-2 py-1.5 rounded border"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0])}
            className="text-sm"
          />
        </div>

        {/* Description */}
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full px-2 py-1.5 rounded border"
        />

        <button
          type="submit"
          className="w-full py-2 bg-slate-900 text-white rounded hover:bg-amber-600"
        >
          Create Product
        </button>
      </form>
    </div>
  );
}

export default AddProductForm;