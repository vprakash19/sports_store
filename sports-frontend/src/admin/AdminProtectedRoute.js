import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminProtectedRoute({ children }) {
  const { isAdminAuthenticated } = useAdminAuth();

  if (!isAdminAuthenticated) {
    // Redirect unauthenticated visitors or normal users to the common login with admin type selected
    return <Navigate to="/login?type=admin" replace />;
  }

  return children;
}
