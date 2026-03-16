import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProfileLayout from '../layouts/ProfileLayout';
import Home from '../pages/Home/Home';
import Match from '../pages/Match/Match';
import Friends from '../pages/Friends/Friends';
import Notifications from '../pages/Notifications/Notifications';
import Login from '../pages/Login/Login';
import Landing from '../pages/Landing/Landing';
import Register from '../pages/Register/Register';
import ProfileEdit from '../pages/EditProfile/ProfileEdit';
import ReputationPage from '../pages/Reputation/ReputationPage';
import PostsPage from '../pages/Posts/PostsPage';
import CreatePostPage from '../pages/Posts/CreatePostPage';
import EditPostPage from '../pages/Posts/EditPostPage';

// Bổ sung dòng import Anh Bảo Vệ vào đây
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import AdminDashboard from '../pages/Admin/AdminDashboard';

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Trang công khai - không cần đăng nhập */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} /> 

        {/* Trang Admin - Chỉ Admin mới vào được */}
        <Route path="/admin" element={
          <AdminRoute>
            <MainLayout><AdminDashboard /></MainLayout>
          </AdminRoute>
        } />

        {/* Các trang VIP: Phải qua Bảo Vệ -> Mặc Đồng Phục (MainLayout) -> Vào Phòng (Home/Match/...) */}
        <Route path="/home" element={
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

        {/* Profile Routes - Sử dụng ProfileLayout */}
        <Route path="/profile/:userId" element={
          <ProtectedRoute>
            <MainLayout noContainer><ProfileLayout /></MainLayout>
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="edit" replace />} />
          <Route path="edit" element={<ProfileEdit />} />
          <Route path="reputation" element={<ReputationPage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="posts/new" element={<CreatePostPage />} />
          <Route path="posts/:id/edit" element={<EditPostPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
