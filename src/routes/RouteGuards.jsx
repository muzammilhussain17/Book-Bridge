import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading session...</div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export const RoleRoute = ({ requiredRole }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading session...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== requiredRole) {
        // If wrong role, bump to their appropriate home
        const homeRoute = user.role === 'ADMIN' ? '/admin' : '/dashboard';
        return <Navigate to={homeRoute} replace />;
    }

    return <Outlet />;
};
