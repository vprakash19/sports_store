import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';

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

// Root Entry Point Component: Checks authentication before opening storefront or asking for login type
function RootRoute() {
  const { isAuthenticated: isUserAuth } = useUser();
  const { isAdminAuthenticated } = useAdminAuth();

  // If logged in as admin, go to Admin Dashboard
  if (isAdminAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If not logged in, ask the user to select their account type first!
  if (!isUserAuth) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated as user, open Storefront
  return <HomePage />;
}

function App() {
  return (
    <UserProvider>
      <WishlistProvider>
        <ProductProvider>
          <CartProvider>
            <AdminAuthProvider>
              <BrowserRouter>
                <Routes>
                  {/* Root Route: Asks login type first if unauthenticated */}
                  <Route path="/" element={<RootRoute />} />

                  {/* Customer Storefront Routes */}
                  <Route path="/shop" element={<HomePage />} />
                  <Route path="/category/:categoryId" element={<HomePage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />

                  {/* Common Authentication Route */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/admin/login" element={<LoginPage />} />

                  {/* Protected Admin Portal Routes */}
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

                  {/* Fallback Route */}
                  <Route path="*" element={<RootRoute />} />
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
