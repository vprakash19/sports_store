import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Search, X, Users, RefreshCw, Mail, Phone, ShoppingBag, AlertCircle } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsersData = async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, ordersRes] = await Promise.all([
        api.get('/customers').catch(() => ({ data: [] })),
        api.get('/orders').catch(() => ({ data: [] }))
      ]);
      setUsers(usersRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load registered users from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsersData();
  }, []);

  // Count orders per customer
  const getCustomerOrderCount = (customerId) => {
    return orders.filter((o) => o.customerId === customerId).length;
  };

  // Filter users based on search
  const filteredUsers = users.filter((u) => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const email = (u.email || '').toLowerCase();
    const phone = (u.phone || '').toLowerCase();
    const id = String(u.customerId || '');
    return fullName.includes(term) || email.includes(term) || phone.includes(term) || id.includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            <h1 className="text-xl font-black text-[#1e293b]">Manage Registered Users</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            View customer details, registered emails, contact information, and order counts.
          </p>
        </div>

        <button
          onClick={loadUsersData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-blue-600' : 'text-slate-600'} />
          <span>Refresh Users</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email, or phone..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="text-xs font-bold text-slate-500 self-end sm:self-center">
          Showing <span className="text-slate-900 font-extrabold">{filteredUsers.length}</span> of {users.length} registered customers
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Loading registered customers from MySQL Aiven Cloud...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            {searchQuery ? `No users matching "${searchQuery}" found.` : 'No registered users found.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-50 text-[11px] font-black uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-5">Customer ID</th>
                  <th className="py-3.5 px-5">Customer Name</th>
                  <th className="py-3.5 px-5">Email Address</th>
                  <th className="py-3.5 px-5">Phone Number</th>
                  <th className="py-3.5 px-5">Total Orders</th>
                  <th className="py-3.5 px-5">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.map((user) => {
                  const initial = (user.firstName || 'U').charAt(0).toUpperCase();
                  const orderCount = getCustomerOrderCount(user.customerId);

                  return (
                    <tr key={user.customerId} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-5 font-black text-slate-900">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-mono text-[11px]">
                          #{user.customerId}
                        </span>
                      </td>

                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                            {initial}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-xs block">
                              {user.firstName} {user.lastName || ''}
                            </span>
                            <span className="text-[10px] text-slate-400">Customer Account</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-5 text-slate-700 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Mail size={13} className="text-slate-400 shrink-0" />
                          <span>{user.email}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-5 text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <Phone size={13} className="text-slate-400 shrink-0" />
                          <span>{user.phone || 'Not provided'}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            orderCount > 0
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <ShoppingBag size={12} />
                          <span>{orderCount} {orderCount === 1 ? 'order' : 'orders'}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-5 text-slate-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Verified Member'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
