import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { useUser } from './UserContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { customerId } = useUser();
  const [wishlistId, setWishlistId] = useState(1);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load customer wishlist & wishlist items
  const loadWishlist = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      // 1. Get or create wishlist for customer
      let wId = 1;
      try {
        const wRes = await api.get(`/wishlists/customer/${customerId}`);
        if (wRes.data && wRes.data.wishlistId) {
          wId = wRes.data.wishlistId;
        }
      } catch (e) {
        // Create wishlist if not found
        try {
          const createRes = await api.post('/wishlists', { customerId });
          wId = createRes.data.wishlistId;
        } catch (err) {
          wId = 1;
        }
      }
      setWishlistId(wId);

      // 2. Fetch items in this wishlist
      const itemsRes = await api.get(`/wishlist-items/wishlist/${wId}`);
      setWishlistItems(itemsRes.data || []);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // Check if a product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => Number(item.productId) === Number(productId));
  };

  // Toggle item in wishlist
  const toggleWishlist = async (productId) => {
    const existing = wishlistItems.find((item) => Number(item.productId) === Number(productId));
    if (existing) {
      // Remove from wishlist
      try {
        await api.delete(`/wishlist-items/${existing.wishlistItemId}`);
      } catch (e) {
        console.error('Error deleting wishlist item:', e);
      }
      setWishlistItems((prev) => prev.filter((i) => i.wishlistItemId !== existing.wishlistItemId));
      return false; // Removed
    } else {
      // Add to wishlist
      try {
        const res = await api.post('/wishlist-items', {
          wishlistId,
          productId: Number(productId)
        });
        setWishlistItems((prev) => [...prev, res.data]);
        return true; // Added
      } catch (e) {
        console.error('Error adding to wishlist:', e);
        const mockItem = {
          wishlistItemId: Date.now(),
          wishlistId,
          productId: Number(productId)
        };
        setWishlistItems((prev) => [...prev, mockItem]);
        return true;
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        toggleWishlist,
        wishlistCount: wishlistItems.length,
        loading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
