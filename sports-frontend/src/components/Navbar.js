import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, User, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar({ onSearch }) {
  const [query, setQuery] = useState('');
  const { totalCount } = useCart();

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearch) onSearch(val);
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  return (
    <header className="bg-[#d7dde4] border-b border-slate-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Runner / Athlete Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 flex items-center justify-center">
            {/* Custom SVG Athlete Runner Silhouette matching Image 1 */}
            <svg
              viewBox="0 0 24 24"
              className="w-9 h-9 fill-black transition group-hover:scale-105"
            >
              <circle cx="16" cy="4" r="2" />
              <path d="M19 8.5c-.8 0-1.5.3-2.1.8L15 11l-2.4-1.2c-.8-.4-1.8-.3-2.4.3L6.5 13.5l1.4 1.4 2.8-2.6 1.8.9-2.2 5.3 1.8.8 2.5-6.1 1.7.9V20h2v-7.2l-2-1 1.6-1.5c.3-.3.7-.4 1.1-.4h1.7V8.5H19z" />
            </svg>
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900 hidden sm:inline">
            SPORTS<span className="text-blue-600">STORE</span>
          </span>
        </Link>

        {/* Center: Search Box with Magnifying Glass and 'X' */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-6 relative">
          <div className="flex items-center bg-white rounded-full border border-slate-400 px-4 py-2 shadow-inner">
            <Search size={18} className="text-slate-700 mr-2 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder="Search sports equipment, footwear, jerseys..."
              className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={handleClear}
                className="text-slate-500 hover:text-black ml-1"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Right: User Profile Icon & Shopping Cart Trolley */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => alert("Customer profile / Login window")}
            className="text-slate-900 hover:text-blue-600 transition"
            title="Account"
          >
            <User size={26} className="stroke-[2.2]" />
          </button>

          <Link
            to="/cart"
            className="text-slate-900 hover:text-blue-600 transition relative flex items-center"
            title="Cart"
          >
            <ShoppingCart size={28} className="stroke-[2]" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-600 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow">
                {totalCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
