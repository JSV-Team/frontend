import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home/Home';
import Match from '../pages/Match/Match';
import Friends from '../pages/Friends/Friends';
import Notifications from '../pages/Notifications/Notifications';
import Login from '../pages/Login/Login';

// Bổ sung dòng import Anh Bảo Vệ vào đây
import ProtectedRoute from './ProtectedRoute'; 

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Trang thả rông: Ai vào cũng được */}
        <Route path="/login" element={<Login />} /> 

        {/* Các trang VIP: Phải qua Bảo Vệ -> Mặc Đồng Phục (MainLayout) -> Vào Phòng (Home/Match/...) */}
        <Route path="/" element={
            <ProtectedRoute>
                <MainLayout><Home /></MainLayout>
            </ProtectedRoute>
        } />
        
        <Route path="/match" element={
            <ProtectedRoute>
                <MainLayout><Match /></MainLayout>
            </ProtectedRoute>
        } />
        
        <Route path="/friends" element={
            <ProtectedRoute>
                <MainLayout><Friends /></MainLayout>
            </ProtectedRoute>
        } />
        
        <Route path="/notifications" element={
            <ProtectedRoute>
                <MainLayout><Notifications /></MainLayout>
            </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default AppRouter;