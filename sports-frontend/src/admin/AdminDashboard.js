import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import {
  Users,
  ShoppingBag,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardData = async () => {
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
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch latest data from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Compute Metrics
  const totalUsers = users.length;
  const totalOrders = orders.length;

  const pendingOrders = orders.filter((o) => {
    const s = (o.orderStatus || '').toUpperCase();
    return s === 'PENDING' || s === 'PROCESSING';
  }).length;

  const completedOrders = orders.filter((o) => {
    const s = (o.orderStatus || '').toUpperCase();
    return s === 'DELIVERED' || s === 'COMPLETED';
  }).length;

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  // Helper to find customer name
  const getCustomerName = (customerId) => {
    const found = users.find((u) => u.customerId === customerId);
    if (found) {
      return `${found.firstName} ${found.lastName || ''}`.trim();
    }
    return `Customer #${customerId}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Refresh Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#1e293b]">Welcome to Admin Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of customers, order status, and business performance.
          </p>
        </div>
        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-blue-600' : 'text-slate-600'} />
          <span>Refresh Data</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* 4 Main Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Users */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Total Users
            </span>
            <div className="text-2xl font-black text-slate-900">
              {loading ? '...' : totalUsers}
            </div>
            <span className="text-[11px] text-blue-600 font-semibold mt-1 inline-block">
              Registered customers
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Users size={24} />
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Total Orders
            </span>
            <div className="text-2xl font-black text-slate-900">
              {loading ? '...' : totalOrders}
            </div>
            <span className="text-[11px] text-indigo-600 font-semibold mt-1 inline-block">
              All time purchases
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <ShoppingBag size={24} />
          </div>
        </div>

        {/* Card 3: Pending Orders */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Pending Orders
            </span>
            <div className="text-2xl font-black text-amber-600">
              {loading ? '...' : pendingOrders}
            </div>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 inline-block">
              Needs fulfillment
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Clock size={24} />
          </div>
        </div>

        {/* Card 4: Completed Orders */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Completed Orders
            </span>
            <div className="text-2xl font-black text-emerald-600">
              {loading ? '...' : completedOrders}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
              Delivered successfully
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
        </div>
      </div>

      {/* Revenue Highlight Banner */}
      <div className="bg-[#1e293b] text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Cumulative Store Revenue
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white">
              ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs"
          >
            <span>Manage All Orders</span>
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-xs"
          >
            <span>Manage Users</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Recent Orders Overview Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-[#1e293b]">Recent Customer Orders</h2>
            <p className="text-xs text-slate-500">Latest orders placed on the store</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>View All ({totalOrders})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading live orders from database...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No orders placed yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-50 text-[11px] font-black uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-5">Order ID</th>
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-5">Order Date</th>
                  <th className="py-3 px-5">Total Amount</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {orders.slice(0, 5).map((ord) => {
                  const status = (ord.orderStatus || 'PENDING').toUpperCase();
                  return (
                    <tr key={ord.orderId} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-5 font-black text-slate-900">
                        #{ord.orderId}
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-slate-800">
                        {getCustomerName(ord.customerId)}
                      </td>
                      <td className="py-3.5 px-5 text-slate-500">
                        {ord.orderDate ? new Date(ord.orderDate).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-3.5 px-5 font-black text-slate-900">
                        ₹{Number(ord.totalAmount).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`inline-block text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            status === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : status === 'CONFIRMED'
                              ? 'bg-blue-100 text-blue-800'
                              : status === 'SHIPPED'
                              ? 'bg-indigo-100 text-indigo-800'
                              : status === 'CANCELLED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Link
                          to="/admin/orders"
                          className="text-xs font-bold text-blue-600 hover:text-blue-800"
                        >
                          Manage →
                        </Link>
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
