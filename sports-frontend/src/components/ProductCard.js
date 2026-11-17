import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Use product fields or fallback to defaults matching Image 1
  const discountPercent = product.discountPercent || 20;
  const currentPrice = product.price || 23500;
  const originalPrice = product.originalPrice || Math.round(currentPrice * 1.25);
  const brandName = product.brandName || (product.brandId === 1 ? 'Nike' : product.brandId === 2 ? 'Adidas' : 'Luzz');
  const title = product.productName || "Luzz Pro4 Inferno2 M1 Pickleball Paddle";
  
  // Default image if not present (pickleball paddle / sports product)
  const imageUrl = product.image || "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&auto=format&fit=crop&q=80";
  const isWishlisted = isInWishlist(product.productId);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.productId);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between p-3.5 relative group overflow-hidden">
      {/* Top Left: Red Circular Discount Badge matching Image 1 */}
      <div className="absolute top-2.5 left-2.5 z-10 w-8 h-8 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
        -{discountPercent}%
      </div>

      {/* Top Right: Wishlist Heart Icon */}
      <button
        onClick={handleWishlistClick}
        title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
        className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full border flex items-center justify-center transition ${
          isWishlisted
            ? 'bg-rose-50 border-rose-300 text-rose-600'
            : 'bg-white/80 border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300'
        }`}
      >
        <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
      </button>

      {/* Clickable Card Linking to Product Details */}
      <Link to={`/product/${product.productId || 1}`} className="flex flex-col flex-1 justify-between">
        {/* Product Image Container */}
        <div className="w-full aspect-square flex items-center justify-center p-2 mb-2 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&auto=format&fit=crop&q=80";
            }}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Bottom Content Area */}
        <div className="flex flex-col items-center text-center mt-auto">
          {/* Red Pill Badge: Fast Dispatch */}
          <div className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-semibold px-4 py-1 rounded-full mb-2 tracking-wide uppercase shadow-xs">
            Fast Dispatch
          </div>

          {/* Brand Name */}
          <span className="text-[11px] text-slate-500 font-medium">
            {brandName}
          </span>

          {/* Product Title */}
          <h3 className="text-xs font-semibold text-slate-800 line-clamp-2 mt-0.5 min-h-[32px] group-hover:text-blue-600 transition">
            {title}
          </h3>

          {/* Pricing: Current Price + Slashed Original Price */}
          <div className="mt-1 flex items-baseline gap-1.5 justify-center">
            <span className="text-xs font-bold text-slate-900">
              ₹ {currentPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 line-through">
              ₹ {originalPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
