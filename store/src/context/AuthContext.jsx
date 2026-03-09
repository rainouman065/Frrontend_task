import { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setLoading, setError, logout as reduxLogout } from '../store/slices/authSlice';
import { api, endpoints, setTokens } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          dispatch(setLoading(false));
          return;
        }
        dispatch(setLoading(true));
        const profile = await api.request('get', endpoints.authProfile);
        dispatch(setUser(profile));
      } catch (err) {
        dispatch(setLoading(false));
      }
    };
    initAuth();
  }, [dispatch]);

  const login = async (email, password) => {
    try {
      dispatch(setLoading(true));
      const data = await api.request('post', endpoints.authLogin, { email, password }, { noAuth: true });
      setTokens(data.access_token, data.refresh_token);
      const profile = await api.request('get', endpoints.authProfile);
      dispatch(setUser(profile));
      return profile;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      dispatch(setError(msg));
      throw new Error(msg);
    }
  };

  const logout = () => {
    dispatch(reduxLogout());
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}