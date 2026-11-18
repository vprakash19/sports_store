import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WishlistModal({ isOpen, onClose }) {
  const { wishlistItems, toggleWishlist, wishlistCount } = useWishlist();
  const { products } = useProducts();
  const { addToCart } = useCart();

  if (!isOpen) return null;

  // Match wishlist items with full product details from catalog
  const savedProducts = wishlistItems
    .map((item) => {
      const prod = products.find((p) => Number(p.productId) === Number(item.productId));
      return prod ? { ...prod, wishlistItemId: item.wishlistItemId } : null;
    })
    .filter(Boolean);

  const handleMoveToCart = (prod) => {
    addToCart(prod, { size: 'Standard', color: 'Default' });
    alert(`Moved "${prod.productName}" to your Cart!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Heart size={18} fill="currentColor" />
            </div>
            <div>
              <h2 className="font-black text-base tracking-tight leading-tight">My Wishlist</h2>
              <p className="text-xs text-slate-400">{wishlistCount} Saved {wishlistCount === 1 ? 'Item' : 'Items'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {savedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-400 mx-auto mb-4">
                <Heart size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mb-6">
                Tap the heart icon on any sports equipment, shoes, or apparel to save them here for later!
              </p>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
              >
                <span>Browse Sports Store</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedProducts.map((prod) => (
                <div
                  key={prod.productId}
                  className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-center gap-4 hover:border-slate-300 transition shadow-2xs"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${prod.productId}`}
                    onClick={onClose}
                    className="w-18 h-18 rounded-lg bg-slate-50 border border-slate-100 p-1 flex items-center justify-center shrink-0 overflow-hidden"
                  >
                    <img
                      src={prod.image}
                      alt={prod.productName}
                      className="max-h-full max-w-full object-contain"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {prod.brandName || 'SPORTS'}
                    </span>
                    <Link
                      to={`/product/${prod.productId}`}
                      onClick={onClose}
                      className="text-xs font-bold text-slate-800 hover:text-blue-600 line-clamp-1 block"
                    >
                      {prod.productName}
                    </Link>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-black text-slate-900">
                        ₹{Number(prod.price || 4999).toLocaleString('en-IN')}
                      </span>
                      {prod.originalPrice > prod.price && (
                        <span className="text-[10px] text-slate-400 line-through">
                          ₹{Number(prod.originalPrice).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleMoveToCart(prod)}
                      title="Add to Cart"
                      className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center transition shadow-2xs font-bold"
                    >
                      <ShoppingBag size={16} />
                    </button>
                    <button
                      onClick={() => toggleWishlist(prod.productId)}
                      title="Remove from Wishlist"
                      className="w-9 h-9 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 flex items-center justify-center transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {savedProducts.length > 0 && (
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              {savedProducts.length} items saved
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
