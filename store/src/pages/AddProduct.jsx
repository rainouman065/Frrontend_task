import AddProductForm from '../components/AddProductForm';

function AddProduct() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Add product</h1>
      <div className="bg-white rounded-2xl shadow border p-6">
        <AddProductForm />
      </div>
    </div>
  );
}

export default AddProduct;
