import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { postService } from "../../services/postService";
import PostCard from "./PostCard";
import "./postsPage.css";

export default function PostsPage() {
  const navigate = useNavigate();
  const { USER_ID, profile } = useOutletContext();
  
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getPostsByUserId(USER_ID);
      setPosts(data);
    } catch (error) {
      console.error("Lỗi khi tải bài đăng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (USER_ID) {
      fetchPosts();
    }
  }, [USER_ID]);

  return (
    <div className="ps-wrap">
      <div className="ps-card">
        <div className="ps-h1">Tạo bài đăng</div>

        <div className="ps-createRow">
          <input
            className="ps-input"
            placeholder="Nhập nội dung..."
            value={content}
            onFocus={() => navigate(`/profile/${profile.username}/posts/new`)}
            onClick={() => navigate(`/profile/${profile.username}/posts/new`)}
            onChange={(e) => setContent(e.target.value)}
          />
          <button className="ps-btn" onClick={() => navigate(`/profile/${profile.username}/posts/new`)}>
            Đăng
          </button>
        </div>
      </div>

      <div className="ps-card ps-feature">
        <div className="ps-featureTitle">Bài viết của bạn</div>

        {loading ? (
          <div className="ps-loading">Đang tải bài viết...</div>
        ) : posts.length === 0 ? (
          <div className="ps-empty">Bạn chưa có bài đăng nào.</div>
        ) : (
          posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              onEdit={(id) => navigate(`/profile/${profile.username}/posts/${id}/edit`)}
              onDelete={async (id) => {
                if (window.confirm("Bạn có chắc muốn xóa bài đăng này?")) {
                  try {
                    const postToDelete = posts.find(p => p.id === id);
                    await postService.deletePost(id, USER_ID, postToDelete?.type);
                    fetchPosts(); // Reload
                  } catch (e) {
                    alert("Xóa thất bại.");
                  }
                }
              }}


              onReact={(id, type) => {
                alert("Tính năng này sẽ được cập nhật sau (liên kết DB). ✅");
              }}
              onComment={(id) => {
                alert("Tính năng này sẽ được cập nhật sau (liên kết DB). ✅");
              }}
              onShare={(id) => {
                alert("Tính năng này sẽ được cập nhật sau (liên kết DB). ✅");
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
