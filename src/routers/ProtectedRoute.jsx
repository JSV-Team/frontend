import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!user || user === 'undefined' || !token) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default ProtectedRoute;