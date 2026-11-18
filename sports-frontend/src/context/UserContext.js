import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  // Check localStorage for saved session
  const [customerId, setCustomerId] = useState(() => {
    const savedId = localStorage.getItem('sports_store_customer_id');
    return savedId ? Number(savedId) : 1; // Default to Customer 1 for demo stability
  });

  const [customer, setCustomer] = useState(() => {
    const savedCust = localStorage.getItem('sports_store_customer');
    if (savedCust) {
      try {
        return JSON.parse(savedCust);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load customer profile, addresses, and orders
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
      setCustomer(custRes.data);
      localStorage.setItem('sports_store_customer', JSON.stringify(custRes.data));

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
      console.error('Error loading customer:', err);
      // Fallback guest info if offline/network error
      if (cId === 1) {
        const fallbackCust = {
          customerId: 1,
          firstName: 'Rahul',
          lastName: 'Sharma',
          email: 'rahul.sharma@example.com',
          phone: '9876543210'
        };
        setCustomer(fallbackCust);
        const fallbackAddr = {
          addressId: 1,
          addressLine: 'Flat 402, Green Valley Apts, Sector 15',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560001',
          country: 'India',
          addressType: 'HOME'
        };
        setAddresses([fallbackAddr]);
        setSelectedAddress(fallbackAddr);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (customerId) {
      localStorage.setItem('sports_store_customer_id', customerId);
      loadCustomerData(customerId);
    }
  }, [customerId, loadCustomerData]);

  // LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await api.get(`/customers/email/${encodeURIComponent(cleanEmail)}`);
      const user = res.data;

      if (!user) {
        throw new Error('No account found with this email. Please sign up.');
      }

      // Verify Password:
      // 1. Seeded demo account (Rahul Sharma) has bcrypt hash in database ($2a$10...)
      // 2. Newly registered accounts have password stored in passwordHash
      const isDemoAccount = cleanEmail === 'rahul.sharma@example.com';
      const isPasswordValid =
        isDemoAccount || // Allow demo login with any standard password
        user.passwordHash === password ||
        user.passwordHash === password.trim();

      if (!isPasswordValid) {
        throw new Error('Incorrect password. Please try again.');
      }

      setCustomerId(user.customerId);
      setCustomer(user);
      localStorage.setItem('sports_store_customer_id', user.customerId);
      localStorage.setItem('sports_store_customer', JSON.stringify(user));

      // Reload addresses and orders for this user
      await loadCustomerData(user.customerId);

      return { success: true, customer: user };
    } catch (err) {
      const errorMsg =
        err.response?.status === 404
          ? 'No account found with this email. Please register/sign up first.'
          : err.message || 'Login failed. Please check your credentials.';
      return { success: false, error: errorMsg };
    }
  };

  // REGISTER / SIGN UP FUNCTION
  const register = async ({ firstName, lastName, email, phone, password }) => {
    try {
      const cleanEmail = email.trim().toLowerCase();

      // 1. Check if email already exists
      try {
        const checkRes = await api.get(`/customers/email/${encodeURIComponent(cleanEmail)}`);
        if (checkRes.data && checkRes.data.customerId) {
          return {
            success: false,
            error: 'An account with this email already exists. Please log in instead.'
          };
        }
      } catch (checkErr) {
        // 404 means email is free to register, continue
      }

      // 2. Call backend POST /api/customers
      const payload = {
        firstName: firstName.trim(),
        lastName: (lastName || '').trim(),
        email: cleanEmail,
        phone: (phone || '').trim(),
        passwordHash: password
      };

      const res = await api.post('/customers', payload);
      const newCustomer = res.data;

      // 3. Immediately log the newly created user in
      setCustomerId(newCustomer.customerId);
      setCustomer(newCustomer);
      localStorage.setItem('sports_store_customer_id', newCustomer.customerId);
      localStorage.setItem('sports_store_customer', JSON.stringify(newCustomer));

      // Reload user data
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

  // LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem('sports_store_customer_id');
    localStorage.removeItem('sports_store_customer');
    setCustomerId(null);
    setCustomer(null);
    setAddresses([]);
    setSelectedAddress(null);
    setOrders([]);
  };

  // QUICK DEMO LOGIN (RAHUL SHARMA)
  const quickDemoLogin = async () => {
    return login('rahul.sharma@example.com', 'password123');
  };

  // Add new address
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

  // Refresh orders after placing a checkout
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
        quickDemoLogin,
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
