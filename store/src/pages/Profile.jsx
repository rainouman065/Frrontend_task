import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user, logout } = useAuth();

 

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-600" />
        <div className="px-8 pb-8 pt-0">
          <div className="-mt-10 mb-4 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-amber-500 flex items-center justify-center text-2xl font-semibold text-slate-900 border-4 border-white shadow">
              {(user.name || user.email || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <br></br>
              <br></br>
              <h1 className="text-2xl font-bold text-slate-900">{user.name || 'User'}</h1>
              <p className="text-slate-600 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Role</p>
              <p className="text-sm font-medium text-slate-800 capitalize">{user.role || 'user'}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Status</p>
              <p className="text-sm font-medium text-emerald-600">Active</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
            >
              Browse products
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
