import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider'; 

const ProtectedRoute = ({ children, adminOnly, condition }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace/>;
    }

    if (adminOnly && !currentUser.isAdmin) {
        return <Navigate to="/" replace />;
    }

    if (condition && !condition(currentUser)) {
        return <Navigate to="/subscribe" replace />;
    }

    return children;
};

export default ProtectedRoute;
