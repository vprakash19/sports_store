import React, { useState, useEffect } from 'react';
import api from '../api/api';
import {
  ShoppingBag,
  Search,
  X,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Check,
  Ban
} from 'lucide-react';

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orderItemsMap, setOrderItemsMap] = useState({});
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [statusNotice, setStatusNotice] = useState(null);
  const [error, setError] = useState('');

  // 1. Fetch Orders and Customers
  const loadOrdersData = async () => {
    setLoading(true);
    setError('');
    try {
      const [ordersRes, customersRes] = await Promise.all([
        api.get('/orders').catch(() => ({ data: [] })),
        api.get('/customers').catch(() => ({ data: [] }))
      ]);

      setOrders(ordersRes.data || []);
      setCustomers(customersRes.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrdersData();
  }, []);

  // 2. Fetch Order Items when an order is expanded
  const toggleExpandOrder = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);

    // If items not cached yet, fetch from backend
    if (!orderItemsMap[orderId]) {
      try {
        const res = await api.get(`/order-items/order/${orderId}`).catch(() => ({ data: [] }));
        setOrderItemsMap((prev) => ({
          ...prev,
          [orderId]: res.data || []
        }));
      } catch (e) {
        console.error('Error fetching items for order', orderId, e);
      }
    }
  };

  // 3. Update Order Status in Live Database
  const handleStatusChange = async (order, newStatus) => {
    if (order.orderStatus === newStatus) return;

    setUpdatingOrderId(order.orderId);
    try {
      const updatedPayload = {
        ...order,
        orderStatus: newStatus
      };

      const res = await api.put(`/orders/${order.orderId}`, updatedPayload);

      // Update state locally
      setOrders((prev) =>
        prev.map((o) => (o.orderId === order.orderId ? { ...o, orderStatus: res.data.orderStatus || newStatus } : o))
      );

      setStatusNotice({
        orderId: order.orderId,
        message: `Order #${order.orderId} status successfully updated to ${newStatus}`
      });

      setTimeout(() => {
        setStatusNotice(null);
      }, 3500);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status in database.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Helper: Find customer by ID
  const getCustomer = (customerId) => {
    return customers.find((c) => c.customerId === customerId) || {
      firstName: 'Customer',
      lastName: `#${customerId}`,
      email: 'No email'
    };
  };

  // Filter Orders
  const filteredOrders = orders.filter((ord) => {
    // 1. Status Filter
    const currentStatus = (ord.orderStatus || 'PENDING').toUpperCase();
    if (statusFilter !== 'ALL' && currentStatus !== statusFilter) {
      return false;
    }

    // 2. Search Query (Order ID, Customer Name, or Email)
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;

    const customer = getCustomer(ord.customerId);
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const orderIdStr = String(ord.orderId);
    const email = (customer.email || '').toLowerCase();

    return orderIdStr.includes(term) || fullName.includes(term) || email.includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-amber-500" />
            <h1 className="text-xl font-black text-[#1e293b]">Manage Customer Orders</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            View placed orders, ordered items, and update live fulfillment statuses.
          </p>
        </div>

        <button
          onClick={loadOrdersData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-blue-600' : 'text-slate-600'} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {statusNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold">
            <Check size={16} className="text-emerald-600 stroke-[3]" />
            <span>{statusNotice.message}</span>
          </div>
          <button onClick={() => setStatusNotice(null)} className="text-emerald-700 hover:text-emerald-900">
            <X size={14} />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {['ALL', ...STATUS_OPTIONS].map((status) => {
            const count =
              status === 'ALL'
                ? orders.length
                : orders.filter((o) => (o.orderStatus || 'PENDING').toUpperCase() === status).length;

            const isSelected = statusFilter === status;

            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1e293b] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{status === 'ALL' ? 'All Orders' : status}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-700 font-bold'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="relative w-full sm:max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Customer Name, or Email..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-9 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
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

          <span className="text-xs font-bold text-slate-500 self-end sm:self-center">
            Showing <strong className="text-slate-900">{filteredOrders.length}</strong> matching orders
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading orders from database...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No orders found matching the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-50 text-[11px] font-black uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-5">Order ID</th>
                  <th className="py-3.5 px-5">Customer</th>
                  <th className="py-3.5 px-5">Date Placed</th>
                  <th className="py-3.5 px-5">Total Amount</th>
                  <th className="py-3.5 px-5">Order Status</th>
                  <th className="py-3.5 px-5">Update Status</th>
                  <th className="py-3.5 px-5 text-right">Items</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredOrders.map((ord) => {
                  const cust = getCustomer(ord.customerId);
                  const status = (ord.orderStatus || 'PENDING').toUpperCase();
                  const isExpanded = expandedOrderId === ord.orderId;
                  const isUpdating = updatingOrderId === ord.orderId;
                  const items = orderItemsMap[ord.orderId] || [];

                  return (
                    <React.Fragment key={ord.orderId}>
                      <tr className="hover:bg-slate-50/80 transition">
                        {/* Order ID */}
                        <td className="py-4 px-5">
                          <span className="font-black text-slate-900 text-sm">#{ord.orderId}</span>
                        </td>

                        {/* Customer */}
                        <td className="py-4 px-5">
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {cust.firstName} {cust.lastName}
                            </span>
                            <span className="text-[10px] text-slate-400">{cust.email}</span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-5 text-slate-500">
                          {ord.orderDate ? new Date(ord.orderDate).toLocaleString() : 'Recent'}
                        </td>

                        {/* Total Amount */}
                        <td className="py-4 px-5 font-black text-slate-900 text-sm">
                          ₹{Number(ord.totalAmount).toLocaleString('en-IN')}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
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
                            {status === 'DELIVERED' && <CheckCircle2 size={12} />}
                            {status === 'SHIPPED' && <Truck size={12} />}
                            {status === 'CONFIRMED' && <Package size={12} />}
                            {status === 'CANCELLED' && <Ban size={12} />}
                            {status === 'PENDING' && <Clock size={12} />}
                            <span>{status}</span>
                          </span>
                        </td>

                        {/* Update Status Dropdown */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <select
                              value={status}
                              disabled={isUpdating}
                              onChange={(e) => handleStatusChange(ord, e.target.value)}
                              className="bg-white border border-slate-300 text-xs font-bold text-slate-800 py-1.5 px-2.5 rounded-lg focus:outline-none focus:border-blue-600 cursor-pointer shadow-2xs disabled:opacity-50"
                            >
                              {STATUS_OPTIONS.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                            {isUpdating && <RefreshCw size={14} className="animate-spin text-blue-600" />}
                          </div>
                        </td>

                        {/* Toggle Items Expand */}
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => toggleExpandOrder(ord.orderId)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition"
                          >
                            <span>Products</span>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Order Items Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="p-0 bg-blue-50/40 border-y border-blue-100">
                            <div className="p-4 sm:p-5 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase text-blue-900 tracking-wider flex items-center gap-1.5">
                                  <Package size={14} />
                                  <span>Items inside Order #{ord.orderId}</span>
                                </span>
                                <span className="text-xs text-slate-500 font-semibold">
                                  Customer ID: #{ord.customerId} • Address ID: #{ord.addressId}
                                </span>
                              </div>

                              {items.length === 0 ? (
                                <div className="text-xs text-slate-500 italic py-2">
                                  Loading product line items...
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {items.map((it) => (
                                    <div
                                      key={it.orderItemId}
                                      className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs shadow-2xs"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">
                                          {it.quantity}x
                                        </div>
                                        <div>
                                          <p className="font-bold text-slate-900">{it.productName}</p>
                                          <p className="text-[11px] text-slate-400">
                                            SKU: <span className="font-mono">{it.sku || 'N/A'}</span>
                                          </p>
                                        </div>
                                      </div>

                                      <div className="text-right">
                                        <span className="font-black text-slate-900 text-sm">
                                          ₹{Number(it.subtotal || it.unitPrice * it.quantity).toLocaleString('en-IN')}
                                        </span>
                                        <p className="text-[10px] text-slate-400">
                                          (₹{Number(it.unitPrice).toLocaleString('en-IN')} each)
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
