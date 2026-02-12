import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // If no token exists, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If allowedRoles is provided, check if user's role is in the list
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    // If token and role are valid, render the child routes (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;
