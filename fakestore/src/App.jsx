import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveTab } from './store/uiSlice';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

const lazyWithDebug = (name, importer) =>
  lazy(() =>
    importer().then((mod) => {
      if (import.meta.env.DEV) {
        console.info(`[lazy] loaded: ${name}`);
        window.dispatchEvent(new CustomEvent('lazy:loaded', { detail: { name, at: Date.now() } }));
      }
      return mod;
    })
  );

const Books = lazyWithDebug('Books', () => import('./pages/Books'));
const Authors = lazyWithDebug('Authors', () => import('./pages/Authors'));
const Users = lazyWithDebug('Users', () => import('./pages/Users'));
const Activities = lazyWithDebug('Activities', () => import('./pages/Activities'));
const Gallery = lazyWithDebug('Gallery', () => import('./pages/Gallery'));

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [lazyDebug, setLazyDebug] = useState(null);

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

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    let timeoutId;
    const handler = (e) => {
      setLazyDebug(e?.detail?.name || 'Unknown');
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => setLazyDebug(null), 2000);
    };
    window.addEventListener('lazy:loaded', handler);
    return () => {
      window.removeEventListener('lazy:loaded', handler);
      window.clearTimeout(timeoutId);
    };
  }, []);
  return (
    <div className={`min-h-screen bg-slate-50 transition-colors duration-300 font-sans`}>
      <Sidebar />
      <div className="lg:pl-72 min-h-screen">
        <Navbar />
        <main className="pt-24 lg:pt-28 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto">
          <Suspense
            fallback={
              <div className="py-12">
                <div className="h-6 w-40 bg-slate-200 rounded animate-pulse" />
                <div className="mt-6 space-y-3">
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-11/12 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-10/12 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            }
          >
            {/* Animated Transition Wrapper (re-triggers on route change) */}
            <div
              key={location.pathname}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out transition-all"
            >
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
          </Suspense>
        </main>
      </div>
      {import.meta.env.DEV && lazyDebug && (
        <div className="fixed bottom-4 right-4 z-[60] bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg">
          Lazy loaded: {lazyDebug}
        </div>
      )}
    </div>
  );
}

export default App;
