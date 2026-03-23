import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Component bảo vệ các route chỉ dành cho Admin
 */
function AdminRoute({ children }) {
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    let user = null;
    if (userString && userString !== 'undefined') {
        try {
            user = JSON.parse(userString);
        } catch (e) {
            user = null;
        }
    }

    if (!user || user === 'undefined' || !token) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'admin') {
        // Nếu đã đăng nhập nhưng không phải admin, đá về trang home
        alert("Bạn không có quyền truy cập vào khu vực quản trị!");
        return <Navigate to="/home" replace />;
    }

    return children;
}

export default AdminRoute;
