import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useWishlist } from '../context/WishlistContext';
import { X, User, MapPin, Package, Heart, Plus, CheckCircle, Clock } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose, onOpenWishlist }) {
  const { customer, addresses, selectedAddress, setSelectedAddress, addAddress, orders } = useUser();
  const { wishlistCount } = useWishlist();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'addresses', 'orders'
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'HOME'
  });

  if (!isOpen) return null;

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.addressLine || !newAddr.city || !newAddr.pincode) {
      alert('Please fill out required address fields');
      return;
    }
    await addAddress(newAddr);
    setShowAddAddress(false);
    setNewAddr({ addressLine: '', city: '', state: '', pincode: '', addressType: 'HOME' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#1e293b] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-lg">
              {customer?.firstName ? customer.firstName.charAt(0) : 'U'}
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">
                {customer?.firstName} {customer?.lastName}
              </h2>
              <p className="text-xs text-slate-300">{customer?.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition text-slate-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User size={16} />
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition ${
              activeTab === 'addresses'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin size={16} />
            <span>Addresses ({addresses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition ${
              activeTab === 'orders'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Package size={16} />
            <span>Orders ({orders.length})</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* 1. Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Customer ID</span>
                  <span className="text-sm font-black text-slate-800">#{customer?.customerId}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                  <span className="text-sm font-black text-slate-800">{customer?.phone || '+91 98765 43210'}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Registered Email</span>
                <span className="text-sm font-semibold text-slate-800">{customer?.email}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div
                  onClick={() => {
                    if (onOpenWishlist) onOpenWishlist();
                  }}
                  className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-center gap-3 cursor-pointer hover:border-rose-400 hover:shadow-xs transition"
                  title="Click to view Wishlist"
                >
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    <Heart size={20} />
                  </div>
                  <div>
                    <span className="text-xl font-black text-rose-900">{wishlistCount}</span>
                    <p className="text-xs font-semibold text-rose-700">Wishlist Items →</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Package size={20} />
                  </div>
                  <div>
                    <span className="text-xl font-black text-blue-900">{orders.length}</span>
                    <p className="text-xs font-semibold text-blue-700">Total Orders</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Saved Delivery Addresses</span>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Plus size={14} />
                  <span>{showAddAddress ? 'Cancel' : 'Add New'}</span>
                </button>
              </div>

              {/* Add Address Form */}
              {showAddAddress && (
                <form onSubmit={handleSaveAddress} className="bg-blue-50/50 border border-blue-200 p-4 rounded-xl space-y-3 mb-4">
                  <h4 className="text-xs font-black text-blue-900 uppercase">New Address Details</h4>
                  <input
                    type="text"
                    placeholder="Address Line (e.g. Flat 101, Sky Tower)"
                    value={newAddr.addressLine}
                    onChange={(e) => setNewAddr({ ...newAddr, addressLine: e.target.value })}
                    required
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City (e.g. Mumbai)"
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      required
                      className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="State (e.g. Maharashtra)"
                      value={newAddr.state}
                      onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                      required
                      className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Pincode (e.g. 400001)"
                      value={newAddr.pincode}
                      onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                      required
                      className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                    <select
                      value={newAddr.addressType}
                      onChange={(e) => setNewAddr({ ...newAddr, addressType: e.target.value })}
                      className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="HOME">HOME</option>
                      <option value="WORK">WORK</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-lg transition"
                  >
                    Save Address
                  </button>
                </form>
              )}

              {/* Address List */}
              <div className="space-y-2">
                {addresses.map((addr) => {
                  const isSelected = selectedAddress?.addressId === addr.addressId;
                  return (
                    <div
                      key={addr.addressId}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin size={18} className={isSelected ? 'text-blue-600 mt-0.5' : 'text-slate-400 mt-0.5'} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {addr.addressType || 'HOME'}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                                Selected for Delivery
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-slate-800 leading-snug">
                            {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                      </div>
                      {isSelected && <CheckCircle size={18} className="text-blue-600 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Recent Orders History</span>
              {orders.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No orders placed yet. Add items to cart to place your first order!
                </div>
              ) : (
                orders.map((ord) => (
                  <div key={ord.orderId} className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-blue-600" />
                        <span className="text-xs font-black text-slate-900">Order #{ord.orderId}</span>
                      </div>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          ord.orderStatus === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : ord.orderStatus === 'CONFIRMED'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {ord.orderStatus || 'CONFIRMED'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock size={13} />
                        <span>{ord.orderDate ? new Date(ord.orderDate).toLocaleDateString() : 'Recent'}</span>
                      </div>
                      <span className="font-black text-slate-900 text-sm">
                        Total: ₹{Number(ord.totalAmount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
