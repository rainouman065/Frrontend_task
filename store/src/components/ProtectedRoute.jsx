import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Protected route:
// - Pehle auth loading khatam hone ka wait
// - Phir agar login nahi hai to / (login) pe redirect
function ProtectedRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);
  const isAuthenticated = !!user;

  // Refresh ke baad jab tak token se profile load ho rahi hai,
  // tab tak kuch bhi redirect mat karo
  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default ProtectedRoute;
