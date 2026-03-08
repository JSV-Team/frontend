import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
        return <Navigate to="/login" replace />;
    }
    
    try {
        const user = JSON.parse(userStr);
        // Kiểm tra user có đầy đủ thông tin cần thiết không
        if (!user || !user.user_id) {
            return <Navigate to="/login" replace />;
        }
    } catch (e) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}

export default ProtectedRoute;
