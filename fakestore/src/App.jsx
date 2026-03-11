import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveTab } from './store/uiSlice';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Books from './pages/Books';
import Authors from './pages/Authors';
import Users from './pages/Users';
import Activities from './pages/Activities';
import Gallery from './pages/Gallery';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Synchronize Redux state with current URL path
    const path = location.pathname;
    const tabMapping = {
      '/books': 'Books',
      '/authors': 'Authors',
      '/users': 'Users',
      '/activities': 'Activities',
      '/gallery': 'Gallery'
    };

    const activeTab = tabMapping[path] || 'Books';
    dispatch(setActiveTab(activeTab));
  }, [location, dispatch]);
  return (
    <div className={`min-h-screen bg-slate-50 transition-colors duration-300 font-sans`}>
      <Sidebar />
      <div className="lg:pl-72 min-h-screen">
        <Navbar />
        <main className="pt-24 lg:pt-28 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto">
          {/* Animated Transition Wrapper */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out transition-all">
            <Routes>
              <Route path="/" element={<Navigate to="/books" replace />} />
              <Route path="/books" element={<Books />} />
              <Route path="/authors" element={<Authors />} />
              <Route path="/users" element={<Users />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="*" element={<Navigate to="/books" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
