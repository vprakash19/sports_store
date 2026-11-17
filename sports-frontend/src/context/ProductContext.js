import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/api';

const ProductContext = createContext();

const CACHE_KEY = 'sports_store_products_cache';

// Maps Category IDs to their database Subcategory IDs
export const CATEGORY_MAP = {
  1: [4, 5, 7],      // Sports Equipment
  2: [6, 8, 9],      // Gym Equipment
  3: [10, 11, 12],   // Fitness Nutrition
  4: [3, 13, 14],    // Sportswear
  5: [1, 2, 15],     // Sports Footwear
  6: [16, 17, 18],   // Sports Accessories
  7: [19, 20, 21],   // Yoga and Wellness
  8: [22, 23, 24],   // Outdoor Sports
  9: [25, 26, 27]    // Protective Gear
};

// Realistic, verified Unsplash product images based on subcategory
export const getProductImage = (subcategoryId) => {
  const imagesBySub = {
    // 1: Sports Equipment
    4: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&q=80", // Cricket Bat
    5: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400&q=80", // Football
    7: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80", // Paddle / Racket
    // 2: Gym Equipment
    6: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&q=80", // Dumbbells
    8: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80", // Bench / Barbell
    9: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&q=80", // Resistance Bands
    // 3: Fitness Nutrition
    10: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&q=80", // Whey Protein
    11: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80", // Creatine
    12: "https://images.unsplash.com/photo-1606149059549-6042addafc5a?w=400&q=80", // Energy Bar
    // 4: Sportswear
    3: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80", // Jersey
    13: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&q=80", // Shorts / Pants
    14: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80", // Compression Tights
    // 5: Sports Footwear
    1: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", // Running Shoes
    2: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&q=80", // Football Boots
    15: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&q=80", // Basketball Shoes
    // 6: Sports Accessories
    16: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80", // Water Bottle
    17: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", // Gym Bag
    18: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&q=80", // Sweatband
    // 7: Yoga and Wellness
    19: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&q=80", // Yoga Mat
    20: "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=400&q=80", // Foam Roller
    21: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80", // Yoga Block
    // 8: Outdoor Sports
    22: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80", // Trekking Bag
    23: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80", // Cycling Helmet
    24: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80", // Swim Goggles
    // 9: Protective Gear
    25: "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=400&q=80", // Knee Guards
    26: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80", // Helmet
    27: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80"  // Shin Guards
  };

  return imagesBySub[subcategoryId] || "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80";
};

export function ProductProvider({ children }) {
  // Read instant cache from localStorage on first render
  const [products, setProducts] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed reading product cache:', e);
    }
    return [];
  });

  // Only show loading spinner on the very first visit when cache is completely empty
  const [loading, setLoading] = useState(products.length === 0);

  // Background fetch to sync with live database without blocking UI
  const fetchProducts = useCallback(async (isInitial = false) => {
    try {
      const [prodRes, varRes] = await Promise.all([
        api.get('/products'),
        api.get('/variants').catch(() => ({ data: [] }))
      ]);

      const variantsList = varRes.data || [];
      const prodList = prodRes.data || [];

      if (prodList.length > 0) {
        const formatted = prodList.map((p, idx) => {
          const matchingVariant = variantsList.find((v) => v.productId === p.productId);
          const currentPrice = matchingVariant ? matchingVariant.price : (p.price || 4999);
          const originalPrice = matchingVariant && matchingVariant.discountPrice
            ? matchingVariant.discountPrice
            : Math.round(currentPrice * 1.25);

          return {
            ...p,
            price: currentPrice,
            originalPrice: originalPrice,
            discountPercent: 20,
            image: getProductImage(p.subcategoryId)
          };
        });

        setProducts(formatted);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(formatted));
        } catch (e) {
          // ignore storage quota errors
        }
      }
    } catch (err) {
      console.error('Error syncing products with backend:', err);
    } finally {
      if (isInitial) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // If no cache, perform blocking initial fetch. If cached, fetch silently in background!
    fetchProducts(products.length === 0);
  }, [fetchProducts, products.length]);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        refreshProducts: () => fetchProducts(false)
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
