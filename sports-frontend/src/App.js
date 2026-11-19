import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

// Customer & Common Pages
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';

// Admin Pages
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminUsers from './admin/AdminUsers';
import AdminOrders from './admin/AdminOrders';
import AdminProtectedRoute from './admin/AdminProtectedRoute';

function App() {
  return (
    <UserProvider>
      <WishlistProvider>
        <ProductProvider>
          <CartProvider>
            <AdminAuthProvider>
              <BrowserRouter>
                <Routes>
                  {/* Customer Storefront Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/category/:categoryId" element={<HomePage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />

                  {/* Common Authentication Route */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/admin/login" element={<LoginPage />} />
                  <Route
                    path="/admin"
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout activePageTitle="Dashboard">
                          <AdminDashboard />
                        </AdminLayout>
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout activePageTitle="Dashboard">
                          <AdminDashboard />
                        </AdminLayout>
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout activePageTitle="Manage Users">
                          <AdminUsers />
                        </AdminLayout>
                      </AdminProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <AdminProtectedRoute>
                        <AdminLayout activePageTitle="Manage Orders">
                          <AdminOrders />
                        </AdminLayout>
                      </AdminProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </BrowserRouter>
            </AdminAuthProvider>
          </CartProvider>
        </ProductProvider>
      </WishlistProvider>
    </UserProvider>
  );
}

export default App;
