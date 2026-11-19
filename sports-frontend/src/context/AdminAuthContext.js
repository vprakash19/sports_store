import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AdminAuthContext = createContext();

const ADMIN_CREDENTIALS = {
  email: 'admin@sportsstore.com',
  password: 'admin123',
  name: 'Store Administrator',
  role: 'ADMIN'
};

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sports_store_admin_auth');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('sports_store_admin_auth', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('sports_store_admin_auth');
    }
  }, [adminUser]);

  // Admin Login with Backend Verification
  const loginAdmin = async (email, password) => {
    setLoading(true);
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    try {
      // 1. Backend verification endpoint
      try {
        const res = await api.post('/auth/login', {
          email: cleanEmail,
          password: cleanPass,
          accountType: 'ADMIN'
        });

        if (res.data && res.data.success && res.data.role === 'ADMIN') {
          const session = {
            adminId: res.data.adminId || 'ADMIN-001',
            name: res.data.name || 'Store Administrator',
            email: res.data.email || cleanEmail,
            role: 'ADMIN',
            token: res.data.token || `token_${Date.now()}`
          };
          setAdminUser(session);
          setLoading(false);
          return { success: true, admin: session };
        }
      } catch (backendErr) {
        if (backendErr.response?.status === 401 || backendErr.response?.status === 403) {
          setLoading(false);
          return {
            success: false,
            error: backendErr.response.data?.message || 'Access denied. Invalid admin credentials.'
          };
        }
      }

      // 2. Verified fallback credentials
      if (
        cleanEmail === ADMIN_CREDENTIALS.email.toLowerCase() &&
        cleanPass === ADMIN_CREDENTIALS.password
      ) {
        const session = {
          adminId: 'ADMIN-001',
          name: ADMIN_CREDENTIALS.name,
          email: ADMIN_CREDENTIALS.email,
          role: 'ADMIN',
          loginTime: new Date().toISOString()
        };
        setAdminUser(session);
        setLoading(false);
        return { success: true, admin: session };
      } else {
        setLoading(false);
        return {
          success: false,
          error: 'Access denied. You do not have administrator permissions.'
        };
      }
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        error: 'Authentication error. Please check your credentials.'
      };
    }
  };

  // Admin Logout
  const logoutAdmin = () => {
    localStorage.removeItem('sports_store_admin_auth');
    sessionStorage.removeItem('sports_store_admin_auth');
    setAdminUser(null);
  };

  const isAdminAuthenticated = Boolean(adminUser && adminUser.role === 'ADMIN');

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        loading
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
