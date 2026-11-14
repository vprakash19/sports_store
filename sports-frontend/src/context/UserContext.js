import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  // Default to Customer ID 1 (Rahul Sharma from DB seed)
  const [customerId, setCustomerId] = useState(() => {
    return Number(localStorage.getItem('sports_store_customer_id')) || 1;
  });
  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load customer data
  const loadCustomerData = useCallback(async (cId) => {
    setLoading(true);
    try {
      // 1. Fetch customer profile
      const custRes = await api.get(`/customers/${cId}`);
      setCustomer(custRes.data);

      // 2. Fetch addresses
      const addrRes = await api.get(`/addresses/customer/${cId}`).catch(() => ({ data: [] }));
      const addrs = addrRes.data || [];
      setAddresses(addrs);
      if (addrs.length > 0) {
        setSelectedAddress(addrs[0]);
      }

      // 3. Fetch order history
      const orderRes = await api.get(`/orders/customer/${cId}`).catch(() => ({ data: [] }));
      setOrders(orderRes.data || []);
    } catch (err) {
      console.error('Error loading customer:', err);
      // Fallback guest info if offline
      setCustomer({
        customerId: cId,
        firstName: 'Rahul',
        lastName: 'Sharma',
        email: 'rahul.sharma@example.com',
        phone: '9876543210'
      });
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sports_store_customer_id', customerId);
    loadCustomerData(customerId);
  }, [customerId, loadCustomerData]);

  // Add new address
  const addAddress = async (newAddr) => {
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
    try {
      const orderRes = await api.get(`/orders/customer/${customerId}`);
      setOrders(orderRes.data || []);
    } catch (e) {
      console.error('Error refreshing orders:', e);
    }
  };

  return (
    <UserContext.Provider
      value={{
        customer,
        customerId,
        setCustomerId,
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        orders,
        refreshOrders,
        loading,
        reloadUser: () => loadCustomerData(customerId)
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
