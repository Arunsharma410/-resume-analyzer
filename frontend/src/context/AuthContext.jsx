// frontend/src/context/AuthContext.jsx
// 🔐 Auth Context - manages user authentication state

import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '@services/api';
import { STORAGE_KEYS } from '@utils/constants';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]     = useState(null);
  const [token, setToken]   = useState(localStorage.getItem(STORAGE_KEYS.TOKEN));
  const [loading, setLoading] = useState(true);

  // ════════════════════════════════════════════════════════════
  // 🚀 INITIAL LOAD - verify token and fetch user
  // ════════════════════════════════════════════════════════════
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser  = localStorage.getItem(STORAGE_KEYS.USER);

      if (!storedToken) {
        setLoading(false);
        return;
      }

      // Use cached user immediately (no flash of loading)
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      }

      // Then verify token by fetching fresh user data
      try {
        const { data } = await authAPI.getMe();
        setUser(data.user);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      } catch (error) {
        // Token invalid - clear everything
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ════════════════════════════════════════════════════════════
  // 📝 REGISTER
  // ════════════════════════════════════════════════════════════
  const register = async (formData) => {
    try {
      const { data } = await authAPI.register(formData);

      // Save token and user
      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.USER,  JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);

      toast.success(data.message || 'Welcome aboard! 🎉');
      return { success: true, user: data.user };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // ════════════════════════════════════════════════════════════
  // 🔑 LOGIN
  // ════════════════════════════════════════════════════════════
  const login = async (credentials) => {
    try {
      const { data } = await authAPI.login(credentials);

      localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
      localStorage.setItem(STORAGE_KEYS.USER,  JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);

      toast.success(data.message || 'Welcome back! 👋');
      return { success: true, user: data.user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // ════════════════════════════════════════════════════════════
  // 🚪 LOGOUT
  // ════════════════════════════════════════════════════════════
  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  // ════════════════════════════════════════════════════════════
  // 🔄 UPDATE USER (after profile edit)
  // ════════════════════════════════════════════════════════════
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  };

  // ════════════════════════════════════════════════════════════
  // 🔄 REFRESH USER (re-fetch from server)
  // ════════════════════════════════════════════════════════════
  const refreshUser = async () => {
    try {
      const { data } = await authAPI.getMe();
      updateUser(data.user);
      return data.user;
    } catch (error) {
      return null;
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    register,
    login,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 🪝 Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;