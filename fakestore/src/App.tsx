import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { setActiveTab } from './store/uiSlice';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

const Books = lazy(() => import('./pages/Books'));
const Authors = lazy(() => import('./pages/Authors'));
const Users = lazy(() => import('./pages/Users'));
const Activities = lazy(() => import('./pages/Activities'));
const Gallery = lazy(() => import('./pages/Gallery'));

function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Synchronize Redux state with current URL path
    const path = location.pathname;
    const tabMapping: Record<string, string> = {
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
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Navigate to="/books" replace />} />
                  <Route path="/books" element={<Books />} />
                  <Route path="/authors" element={<Authors />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/activities" element={<Activities />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="*" element={<Navigate to="/books" replace />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default App;
