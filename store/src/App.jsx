import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AddProduct from './pages/AddProduct';
import Categories from './pages/Categories';
import Locations from './pages/Locations';
import Users from './pages/Users';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
                <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
                <Route path="/locations" element={<ProtectedRoute><Locations /></ProtectedRoute>} />
                <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
