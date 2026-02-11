import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logout as apiLogout } from '../api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  const updateUser = (userData) => {
    const storedToken = localStorage.getItem('token');
    const nextUser = storedToken && !userData.token
      ? { ...userData, token: storedToken }
      : userData;
    setUser(nextUser);
    localStorage.setItem('user', JSON.stringify(nextUser));
  };

  const isBuyer = () => user?.role === 'buyer';
  const isSeller = () => user?.role === 'seller' || user?.role === 'admin';
  const isAdmin = () => user?.role === 'admin';

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isBuyer,
    isSeller,
    isAdmin,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
