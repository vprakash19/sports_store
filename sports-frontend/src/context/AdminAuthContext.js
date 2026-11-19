import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

// Pre-configured Admin Credentials
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

  // Admin Login
  const loginAdmin = async (email, password) => {
    setLoading(true);
    // Simulate brief network authentication check
    await new Promise((resolve) => setTimeout(resolve, 350));

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

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
        error: 'Invalid admin credentials. Please enter authorized admin email and password.'
      };
    }
  };

  // Admin Logout
  const logoutAdmin = () => {
    localStorage.removeItem('sports_store_admin_auth');
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
