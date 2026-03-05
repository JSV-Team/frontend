import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Match from "../pages/Match/Match";
import Friends from "../pages/Friends/Friends";
import Notifications from "../pages/Notifications/Notifications";
import EditProfilePage from "../pages/EditProfile/EditProfilePage";
import ReputationPage from "../pages/Reputation/ReputationPage";
import PostsPage from "../pages/Posts/PostsPage";
import CreatePostPage from "../pages/Posts/CreatePostPage";
import EditPostPage from "../pages/Posts/EditPostPage";
import Login from "../pages/Login/Login";

// Bổ sung dòng import Anh Bảo Vệ vào đây
import ProtectedRoute from "./ProtectedRoute";

function AppRouter() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/match" element={<Match />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route
            path="/profile"
            element={<Navigate to="/profile/edit" replace />}
          />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/profile/reputation" element={<ReputationPage />} />
          <Route path="/profile/posts" element={<PostsPage />} />
          <Route path="/profile/posts/new" element={<CreatePostPage />} />
          <Route path="/profile/posts/:id/edit" element={<EditPostPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default AppRouter;
