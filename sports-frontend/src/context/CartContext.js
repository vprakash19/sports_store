import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Initialize with a default item from the design wireframe (Page 3)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('sports_store_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 1,
        productId: 1,
        brand: 'KIPRUN',
        name: "Men Road Running Max Cushion Breathable Sports Shoes",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
        size: "6.5",
        quantity: 1,
        price: 12999,
        originalPrice: 15999,
        pickupText: "Pickup after 5 pm, 09th Nov 2026"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('sports_store_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, selectedVariant = {}) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.productId && item.size === (selectedVariant.size || '8')
      );
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: Date.now(),
          productId: product.productId,
          brand: product.brandName || 'SPORTS',
          name: product.productName,
          image: product.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
          size: selectedVariant.size || '8',
          color: selectedVariant.color || 'Black',
          quantity: 1,
          price: product.price || 12999,
          originalPrice: product.originalPrice || 15999,
          pickupText: "Pickup after 5 pm, 09th Nov 2026"
        }
      ];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const updateSize = (id, newSize) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, size: newSize } : item))
    );
  };

  const clearCart = () => setCart([]);

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateSize,
        clearCart,
        totalAmount,
        totalCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
