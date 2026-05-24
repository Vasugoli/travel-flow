import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'manager' | 'dispatcher')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role is not allowed, redirect to dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Allow access (renders child routes via Outlet)
  return <Outlet />;
};

export default ProtectedRoute;
