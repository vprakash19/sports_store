import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Home / All Products */}
          <Route path="/" element={<HomePage />} />

          {/* Dedicated Category Page Route */}
          <Route path="/category/:categoryId" element={<HomePage />} />

          {/* Product Detail Page */}
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* Shopping Cart Page */}
          <Route path="/cart" element={<CartPage />} />

          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
