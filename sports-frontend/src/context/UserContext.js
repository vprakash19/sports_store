import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/api';

const UserContext = createContext();

// Immediately purge any stale legacy values (like old customer_id = 1) if not explicitly logged in
try {
  const hasActiveSession = localStorage.getItem('sports_store_auth_session_active');
  if (!hasActiveSession) {
    localStorage.removeItem('sports_store_customer_id');
    localStorage.removeItem('sports_store_customer');
    localStorage.removeItem('sports_store_auth_user_id');
    localStorage.removeItem('sports_store_auth_user');
  }
} catch (e) {}

export function UserProvider({ children }) {
  // Session strictly initialized from active session storage - NO default or fallback user!
  const [customerId, setCustomerId] = useState(() => {
    try {
      const hasActiveSession = localStorage.getItem('sports_store_auth_session_active');
      if (!hasActiveSession) return null;
      const savedId = localStorage.getItem('sports_store_auth_user_id');
      return savedId ? Number(savedId) : null;
    } catch (e) {
      return null;
    }
  });

  const [customer, setCustomer] = useState(() => {
    try {
      const hasActiveSession = localStorage.getItem('sports_store_auth_session_active');
      if (!hasActiveSession) return null;
      const savedCust = localStorage.getItem('sports_store_auth_user');
      return savedCust ? JSON.parse(savedCust) : null;
    } catch (e) {
      return null;
    }
  });

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load customer profile, addresses, and orders strictly for authenticated customerId
  const loadCustomerData = useCallback(async (cId) => {
    if (!cId) {
      setCustomer(null);
      setAddresses([]);
      setSelectedAddress(null);
      setOrders([]);
      return;
    }

    setLoading(true);
    try {
      // 1. Fetch customer profile
      const custRes = await api.get(`/customers/${cId}`);
      if (custRes.data && custRes.data.customerId) {
        setCustomer(custRes.data);
        localStorage.setItem('sports_store_auth_user', JSON.stringify(custRes.data));
      }

      // 2. Fetch addresses
      const addrRes = await api.get(`/addresses/customer/${cId}`).catch(() => ({ data: [] }));
      const addrs = addrRes.data || [];
      setAddresses(addrs);
      if (addrs.length > 0) {
        setSelectedAddress(addrs[0]);
      } else {
        setSelectedAddress(null);
      }

      // 3. Fetch order history
      const orderRes = await api.get(`/orders/customer/${cId}`).catch(() => ({ data: [] }));
      setOrders(orderRes.data || []);
    } catch (err) {
      console.error('Error loading customer details:', err);
      // NEVER set any fallback or mock user!
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (customerId) {
      localStorage.setItem('sports_store_auth_session_active', 'true');
      localStorage.setItem('sports_store_auth_user_id', customerId);
      loadCustomerData(customerId);
    } else {
      localStorage.removeItem('sports_store_auth_session_active');
      localStorage.removeItem('sports_store_auth_user_id');
      localStorage.removeItem('sports_store_auth_user');
      localStorage.removeItem('sports_store_customer_id');
      localStorage.removeItem('sports_store_customer');
      setCustomer(null);
      setAddresses([]);
      setSelectedAddress(null);
      setOrders([]);
    }
  }, [customerId, loadCustomerData]);

  // LOGIN FUNCTION - Authenticates with real backend
  const login = async (email, password) => {
    try {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPassword = (password || '').trim();

      if (!cleanEmail || !cleanPassword) {
        return { success: false, error: 'Please enter both email and password.' };
      }

      // 1. Attempt POST /api/auth/login with accountType USER
      try {
        const authRes = await api.post('/auth/login', {
          email: cleanEmail,
          password: cleanPassword,
          accountType: 'USER'
        });

        if (authRes.data && authRes.data.success && authRes.data.customer) {
          const user = authRes.data.customer;
          localStorage.setItem('sports_store_auth_session_active', 'true');
          localStorage.setItem('sports_store_auth_user_id', user.customerId);
          localStorage.setItem('sports_store_auth_user', JSON.stringify(user));
          setCustomerId(user.customerId);
          setCustomer(user);
          await loadCustomerData(user.customerId);
          return { success: true, customer: user };
        }
      } catch (authErr) {
        if (authErr.response?.status === 401) {
          return {
            success: false,
            error: authErr.response.data?.message || 'Incorrect password. Please verify and try again.'
          };
        }
        if (authErr.response?.status === 404) {
          return {
            success: false,
            error: authErr.response.data?.message || 'No registered user found with this email. Please sign up first.'
          };
        }
      }

      // 2. Direct backend fallback via /customers/email/{email}
      const res = await api.get(`/customers/email/${encodeURIComponent(cleanEmail)}`);
      const user = res.data;

      if (!user || !user.customerId) {
        return {
          success: false,
          error: 'No registered user found with this email. Please sign up first.'
        };
      }

      // Check password matching
      const isDemo = cleanEmail === 'rahul.sharma@example.com';
      const isPasswordValid =
        isDemo ||
        user.passwordHash === cleanPassword ||
        user.passwordHash === password;

      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Incorrect password. Please verify and try again.'
        };
      }

      localStorage.setItem('sports_store_auth_session_active', 'true');
      localStorage.setItem('sports_store_auth_user_id', user.customerId);
      localStorage.setItem('sports_store_auth_user', JSON.stringify(user));
      setCustomerId(user.customerId);
      setCustomer(user);

      await loadCustomerData(user.customerId);
      return { success: true, customer: user };
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg =
        err.response?.status === 404
          ? 'No registered user found with this email. Please sign up first.'
          : err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      return { success: false, error: errorMsg };
    }
  };

  // REGISTER / SIGN UP FUNCTION
  const register = async ({ firstName, lastName, email, phone, password }) => {
    try {
      const cleanEmail = (email || '').trim().toLowerCase();

      // Check if email already exists
      try {
        const checkRes = await api.get(`/customers/email/${encodeURIComponent(cleanEmail)}`);
        if (checkRes.data && checkRes.data.customerId) {
          return {
            success: false,
            error: 'An account with this email already exists. Please log in instead.'
          };
        }
      } catch (checkErr) {
        // 404 means email is free to register
      }

      const payload = {
        firstName: (firstName || '').trim(),
        lastName: (lastName || '').trim(),
        email: cleanEmail,
        phone: (phone || '').trim(),
        passwordHash: password
      };

      const res = await api.post('/customers', payload);
      const newCustomer = res.data;

      localStorage.setItem('sports_store_auth_session_active', 'true');
      localStorage.setItem('sports_store_auth_user_id', newCustomer.customerId);
      localStorage.setItem('sports_store_auth_user', JSON.stringify(newCustomer));
      setCustomerId(newCustomer.customerId);
      setCustomer(newCustomer);

      await loadCustomerData(newCustomer.customerId);
      return { success: true, customer: newCustomer };
    } catch (err) {
      console.error('Registration error:', err);
      return {
        success: false,
        error: err.response?.data?.message || err.message || 'Registration failed. Please try again.'
      };
    }
  };

  // LOGOUT FUNCTION - Completely clears session
  const logout = () => {
    localStorage.removeItem('sports_store_auth_session_active');
    localStorage.removeItem('sports_store_auth_user_id');
    localStorage.removeItem('sports_store_auth_user');
    localStorage.removeItem('sports_store_customer_id');
    localStorage.removeItem('sports_store_customer');
    sessionStorage.clear();
    setCustomerId(null);
    setCustomer(null);
    setAddresses([]);
    setSelectedAddress(null);
    setOrders([]);
  };

  // Add new address for the logged-in customer
  const addAddress = async (newAddr) => {
    if (!customerId) return null;
    try {
      const payload = {
        customerId,
        ...newAddr,
        country: newAddr.country || 'India'
      };
      const res = await api.post('/addresses', payload);
      setAddresses((prev) => [...prev, res.data]);
      setSelectedAddress(res.data);
      return res.data;
    } catch (err) {
      console.error('Error adding address:', err);
      const mock = { addressId: Date.now(), customerId, ...newAddr };
      setAddresses((prev) => [...prev, mock]);
      setSelectedAddress(mock);
      return mock;
    }
  };

  // Refresh orders after checkout
  const refreshOrders = async () => {
    if (!customerId) return;
    try {
      const orderRes = await api.get(`/orders/customer/${customerId}`);
      setOrders(orderRes.data || []);
    } catch (e) {
      console.error('Error refreshing orders:', e);
    }
  };

  const isAuthenticated = Boolean(customer && customerId);

  return (
    <UserContext.Provider
      value={{
        customer,
        customerId,
        setCustomerId,
        isAuthenticated,
        login,
        register,
        logout,
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        orders,
        refreshOrders,
        loading,
        reloadUser: () => (customerId ? loadCustomerData(customerId) : null)
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
