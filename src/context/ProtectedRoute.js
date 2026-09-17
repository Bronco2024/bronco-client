import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { sanitizeAuthReturnPath } from '@/helpers/auth-return';

const ProtectedRoute = ({ children, adminOnly }) => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        const next = sanitizeAuthReturnPath(
            `${location.pathname}${location.search || ""}`
        );
        const to = next ? `/login?next=${encodeURIComponent(next)}` : "/login";
        return <Navigate to={to} replace />;
    }

    if (adminOnly && !currentUser.isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
