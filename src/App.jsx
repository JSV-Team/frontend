import { Routes, Route, Navigate } from "react-router-dom";
import EditProfilePage from "./pages/EditProfilePage";
import ReputationPage from "./pages/ReputationPage";
import PostsPage from "./pages/PostsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/profile/edit" replace />} />
      <Route path="/profile/edit" element={<EditProfilePage />} />
      <Route path="/profile/reputation" element={<ReputationPage />} />
      <Route path="/profile/posts" element={<PostsPage />} />
    </Routes>
  );
}