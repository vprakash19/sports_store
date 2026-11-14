import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { MapPin, Trash2, Heart, Gift, ChevronDown, Plus, Minus, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { cart, updateQuantity, updateSize, removeFromCart, clearCart, totalAmount } = useCart();

  return (
    <div className="min-h-screen bg-white flex flex-col text-slate-900">
      {/* 1. Shared Navbar */}
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        {/* Top Active Tab Indicator matching Image 3 */}
        <div className="w-full border-b-2 border-slate-200 mb-6 relative">
          <div className="w-64 h-1 bg-indigo-600 absolute -bottom-[2px] left-0 rounded-full"></div>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Bag is Empty</h2>
            <p className="text-slate-500 mb-6">Explore our sports categories and add your favorite items!</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <ArrowLeft size={18} />
              <span>Continue Shopping</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Items & Delivery Address (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Header Title with Clear/Trash icon */}
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Cart Items
                </h1>
                <button
                  onClick={clearCart}
                  title="Clear all items"
                  className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-600 hover:border-red-300 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Delivery Location Banner with Pin Icon matching Image 3 */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800">
                    Delivery to <strong className="text-blue-900">Bangalore Central, Bangalore, 560001, Karnataka</strong>
                  </span>
                </div>
                <button
                  onClick={() => alert("Please sign in to update address")}
                  className="text-xs sm:text-sm font-bold text-blue-600 hover:underline shrink-0"
                >
                  Login
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex flex-col gap-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-5 items-start sm:items-center shadow-xs"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-slate-50 border border-slate-100 p-2 flex items-center justify-center shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                        <span className="text-slate-900 font-extrabold">{item.brand}</span> | {item.name}
                      </div>

                      {/* Size & Quantity Selectors */}
                      <div className="flex items-center gap-4 mt-2.5">
                        {/* Size Dropdown */}
                        <div className="relative">
                          <select
                            value={item.size}
                            onChange={(e) => updateSize(item.id, e.target.value)}
                            className="appearance-none bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 py-1.5 pl-3 pr-7 rounded-md focus:outline-none cursor-pointer"
                          >
                            <option value="6.5">Size 6.5</option>
                            <option value="7">Size 7</option>
                            <option value="8">Size 8</option>
                            <option value="9">Size 9</option>
                            <option value="10">Size 10</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600" />
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center border border-slate-300 rounded-md bg-white">
                          <span className="text-xs text-slate-500 font-medium px-2">Qty</span>
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-2 py-1 text-slate-600 hover:text-black hover:bg-slate-100 transition"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="text-xs font-bold px-2 text-slate-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-2 py-1 text-slate-600 hover:text-black hover:bg-slate-100 transition"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Price & Action Icons */}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-base font-black text-slate-900">
                          MRP ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            title="Save to Wishlist"
                            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-rose-600 hover:border-rose-300 transition"
                          >
                            <Heart size={15} />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            title="Remove Item"
                            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-red-600 hover:border-red-300 transition"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Green Pickup Notice matching Image 3 */}
                      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                        <span>{item.pickupText || 'Pickup after 5 pm, 09th Nov 2026'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Login Prompt & Order Summary (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Rewards / Login Box matching Image 3 */}
              <div className="bg-[#f5f3ff] rounded-2xl border border-indigo-100 p-6 flex flex-col items-center text-center shadow-xs">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm mb-3">
                  <Gift size={24} />
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-xs mb-4">
                  Oops... You're not logged in! Log in now to unlock more exclusive <strong className="text-slate-900">Rewards and Vouchers!</strong>
                </p>
                <button
                  onClick={() => alert("Login modal / authentication")}
                  className="w-32 py-2 rounded-full border border-slate-400 bg-white hover:bg-slate-50 font-bold text-xs text-slate-800 shadow-xs transition"
                >
                  Login
                </button>
              </div>

              {/* Order Summary Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <h2 className="text-base font-bold text-slate-900 mb-4">
                  Order Summary
                </h2>

                <div className="flex items-center justify-between text-sm text-slate-700 mb-1">
                  <span>Total MRP</span>
                  <span className="font-bold text-slate-900">
                    ₹{totalAmount.toLocaleString('en-IN')}.00
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mb-4">
                  Convenience fee will be calculated on next step
                </p>

                <hr className="border-slate-200 mb-4" />

                <div className="flex items-center justify-between text-base font-black text-slate-900 mb-6">
                  <span>Total</span>
                  <span className="text-xl">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={() => alert("Proceeding to checkout with " + totalAmount)}
                  className="w-full bg-[#d99b26] hover:bg-[#c4881d] text-slate-950 font-black text-sm py-3.5 rounded-xl shadow-sm transition active:scale-98"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>

              {/* Green Free Delivery Ribbon Banner matching Image 3 */}
              <div className="relative bg-[#dcfce7] text-[#166534] text-xs font-bold py-3 px-6 text-center rounded-sm shadow-xs border border-emerald-200">
                Hurray! You have unlocked free delivery for your order
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
