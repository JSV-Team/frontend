import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import EditProfilePage from "./pages/EditProfile/EditProfilePage";
import ReputationPage from "./pages/Reputation/ReputationPage";
import PostsPage from "./pages/Posts/PostsPage";

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/profile/reputation" element={<ReputationPage />} />
        <Route path="/profile/posts" element={<PostsPage />} />
      </Routes>
    </MainLayout>
  );
}
