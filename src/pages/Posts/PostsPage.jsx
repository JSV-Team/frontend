import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SidebarProfile from "../../components/SidebarProfile/SidebarProfile";
import TopTabs from "../../components/TopTabs/TopTabs";
import StatBar from "../../components/StatBar/StatBar";
import PostCard from "./PostCard";
import "../profileLayout.css";
import "./postsPage.css";

// Hàm lấy dữ liệu profile từ localStorage hoặc giá trị mặc định
const getInitialProfile = () => {
  const saved = localStorage.getItem("userProfile");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing saved profile:", e);
    }
  }
  return {
    fullName: "Bạn",
    gender: "Khác",
    dobISO: "2000-01-02",
    email: "hxoa@gmail.com",
    avatar: null,
  };
};

export default function PostsPage() {
  const navigate = useNavigate();
  const profile = getInitialProfile();

  const stats = useMemo(
    () => ({ reputation: 100, fer: 100, fing: 100, group: 100 }),
    []
  );

  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("posts");
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing posts:", e);
      }
    } else {
      // fallback demo
      setPosts([
        {
          id: 1,
          title: "Một buổi chiều chill cùng nhóm",
          time: "2/25/2026, 10:37:51 PM",
          desc: "Hôm nay mình đi cafe và trò chuyện với mọi người, chia sẻ vài chiếc ảnh.",
          image:
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop",
        },
      ]);
    }
  }, []);

  return (
    <div className="vm-page">
      <SidebarProfile
        profile={{ ...profile, stats }}
        onLogout={() => alert("Logout (demo)")}
      />

      <main className="vm-main">
        <TopTabs active="posts" />
        <StatBar stats={stats} />

        <div className="ps-card">
          <div className="ps-h1">Tạo bài đăng</div>

          <div className="ps-createRow">
            <input
              className="ps-input"
              placeholder="Nhập nội dung..."
              value={content}
              onFocus={() => navigate("/profile/posts/new")}
              onClick={() => navigate("/profile/posts/new")}
              onChange={(e) => setContent(e.target.value)}
            />
            <button className="ps-btn" onClick={() => navigate("/profile/posts/new")}>
              Đăng
            </button>
          </div>
        </div>

        <div className="ps-card ps-feature">
          <div className="ps-featureTitle">Bài viết nổi bật</div>

          {posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              onEdit={(id) => navigate(`/profile/posts/${id}/edit`)}
              onDelete={(id) => {
                const next = posts.filter((x) => x.id !== id);
                setPosts(next);
                localStorage.setItem("posts", JSON.stringify(next));
              }}
              onReact={(id, type) => {
                const next = posts.map((x) => {
                  if (x.id !== id) return x;
                  const reactions = {
                    like: 0,
                    love: 0,
                    haha: 0,
                    sad: 0,
                    angry: 0,
                    ...(x.reactions || {})
                  };
                  reactions[type] = (reactions[type] || 0) + 1;
                  return { ...x, reactions };
                });
                setPosts(next);
                localStorage.setItem("posts", JSON.stringify(next));
              }}
              onComment={(id) => {
                const text = prompt("Nhập bình luận:");
                if (!text?.trim()) return;

                const currentUser = {
                  userId: 1,
                  name: profile.fullName || "Bạn",
                  avatar: profile.avatar || "https://picsum.photos/seed/user1/80/80",
                };

                const next = posts.map((x) => {
                  if (x.id !== id) return x;

                  const comments = [
                    ...(x.comments || []),
                    {
                      id: Date.now(),
                      userId: currentUser.userId,
                      name: currentUser.name,
                      avatar: currentUser.avatar,
                      text: text.trim(),
                      time: new Date().toLocaleString(),
                    },
                  ];

                  return { ...x, comments };
                });

                setPosts(next);
                localStorage.setItem("posts", JSON.stringify(next));
              }}
              onShare={(id) => {
                const next = posts.map((x) => (x.id === id ? { ...x, shares: (x.shares || 0) + 1 } : x));
                setPosts(next);
                localStorage.setItem("posts", JSON.stringify(next));
                alert("Đã share (demo) ✅");
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

