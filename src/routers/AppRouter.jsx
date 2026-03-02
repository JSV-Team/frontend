import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home/Home';
import Match from '../pages/Match/Match';
import Friends from '../pages/Friends/Friends';
import EditProfilePage from '../pages/EditProfile/EditProfilePage';
import ReputationPage from '../pages/Reputation/ReputationPage';
import PostsPage from '../pages/Posts/PostsPage';

function AppRouter() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/match" element={<Match />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/profile/reputation" element={<ReputationPage />} />
          <Route path="/profile/posts" element={<PostsPage />} />
        </Routes>
