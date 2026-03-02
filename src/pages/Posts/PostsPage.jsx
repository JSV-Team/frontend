import { useMemo, useState } from "react";
import SidebarProfile from "../components/SidebarProfile/SidebarProfile";
import TopTabs from "../components/TopTabs/TopTabs";
import StatBar from "../components/StatBar/StatBar";
import "./profileLayout.css";
import "./postsPage.css";

export default function PostsPage() {
  const profile = useMemo(
    () => ({
      fullName: "Bạn",
      gender: "Khác",
      dobISO: "2000-01-02",
      email: "hxoa@gmail.com",
    }),
    []
  );

  const stats = useMemo(
    () => ({ reputation: 100, fer: 100, fing: 100, group: 100 }),
    []
  );

  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Một buổi chiều chill cùng nhóm",
      time: "2/25/2026, 10:37:51 PM",
      desc: "Hôm nay mình đi cafe và trò chuyện với mọi người, chia sẻ vài chiếc ảnh.",
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop",
    },
  ]);

  const onPost = () => {
    if (!content.trim()) return;
    const newPost = {
      id: Date.now(),
      title: content.trim(),
      time: new Date().toLocaleString(),
      desc: "Hôm nay mình chia sẻ một bài mới.",
      image: posts[0]?.image,
    };
    setPosts((prev) => [newPost, ...prev]);
    setContent("");
  };

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
              onChange={(e) => setContent(e.target.value)}
            />
            <button className="ps-btn" onClick={onPost}>
              Đăng
            </button>
          </div>
        </div>

        <div className="ps-card ps-feature">
          <div className="ps-featureTitle">Bài viết nổi bật</div>

          {posts.map((p) => (
            <div key={p.id} className="ps-post">
              <div className="ps-postTitle">{p.title}</div>
              <div className="ps-meta">Người dùng • {p.time}</div>
              <div className="ps-desc">Mô tả ngắn: {p.desc}</div>
              {p.image && <img className="ps-img" src={p.image} alt="post" />}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}