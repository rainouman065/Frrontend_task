import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useState } from 'react';

function Navbar() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const initial =
    (user && (user.name || user.email || '').charAt(0).toUpperCase()) || '?';

  function onLogout() {
    setOpen(false);
    Swal.fire({
      icon: 'success',
      title: 'Logged out',
      text: 'You have been logged out successfully.',
      timer: 1500,
      showConfirmButton: false,
    });
    dispatch(logout());
    navigate('/');
  }

  if (loading) return null;
  if (location.pathname === '/' || location.pathname === '/login') return null;

  const navLink = (to, label, options = {}) => {
    const { exact = true, alsoMatchPrefix } = options;

    let isActive =
      exact && !alsoMatchPrefix
        ? location.pathname === to
        : location.pathname === to ||
        location.pathname.startsWith(to + '/');

    if (alsoMatchPrefix)
      isActive =
        isActive ||
        (location.pathname.startsWith(alsoMatchPrefix + '/') &&
          location.pathname.length > alsoMatchPrefix.length + 1);

    return (
      <Link
        to={to}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
            ? 'bg-amber-500 text-slate-900'
            : 'text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-slate-900 text-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center h-16">

          {/* LOGO */}
          <Link
            to={isAuthenticated ? '/products' : '/'}
            className="text-xl font-bold hover:text-amber-400"
          >
            Store
          </Link>

          {/* RIGHT SIDE */}
          <div className="ml-auto flex items-center gap-4">

            {/* NAV LINKS */}
            {isAuthenticated && (
              <ul className="flex items-center gap-1 sm:gap-2">
                <li>{navLink('/products', 'Products', { exact: false, alsoMatchPrefix: '/product' })}</li>
                <li>{navLink('/categories', 'Categories')}</li>
                <li>{navLink('/locations', 'Locations')}</li>
                <li>{navLink('/users', 'Users')}</li>
              </ul>
            )}

            {/* PROFILE DROPDOWN */}
            {isAuthenticated && (
              <div className="relative">

                {/* Avatar Button */}
                <button
                  onClick={() => setOpen(!open)}
                  className="h-9 w-9 rounded-full bg-amber-500 flex items-center justify-center text-sm font-semibold text-slate-900 border-2 border-white shadow hover:bg-amber-400"
                >
                  {initial}
                </button>

                {/* Dropdown */}
                {open && (
                  <div className="absolute right-0 mt-3 w-44 bg-white text-slate-800 rounded-lg shadow-lg overflow-hidden">

                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 hover:bg-slate-100"
                    >
                      Profile
                    </Link>

                    <button
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                    >
                      Logout
                    </button>

                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;