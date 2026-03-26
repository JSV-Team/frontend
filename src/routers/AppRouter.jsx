import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
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

import ProtectedRoute from './ProtectedRoute';
import ProfileViewSelector from './ProfileViewSelector';
import AdminRoute from '../routes/AdminRoute';
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import PostManagement from '../pages/admin/PostManagement';
import ReportManagement from '../pages/admin/ReportManagement';
import Statistics from '../pages/admin/Statistics';
import AdminSettings from '../pages/admin/AdminSettings';
import SystemSettings from '../pages/admin/SystemSettings';

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Trang công khai - không cần đăng nhập */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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

        <Route path="/chat" element={<Navigate to="/friends" replace />} />

        <Route path="/notifications" element={
          <ProtectedRoute>
            <MainLayout><Notifications /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Profile Routes - Sử dụng ProfileLayout */}
        <Route path="/profile/:userId" element={
          <ProtectedRoute>
            <MainLayout noContainer><ProfileViewSelector /></MainLayout>
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="edit" replace />} />
          <Route path="edit" element={<ProfileEdit />} />
          <Route path="reputation" element={<ReputationPage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="posts/new" element={<CreatePostPage />} />
          <Route path="posts/:id/edit" element={<EditPostPage />} />
        </Route>

        {/* Admin Routes - Chỉ dành cho sếp */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="posts" element={<PostManagement />} />
            <Route path="reports" element={<ReportManagement />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="settings" element={<SystemSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
