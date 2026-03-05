import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SidebarProfile from "../../components/SidebarProfile/SidebarProfile";
import TopTabs from "../../components/TopTabs/TopTabs";
import StatBar from "../../components/StatBar/StatBar";
import "../profileLayout.css";
import "./createPostPage.css"; // dùng lại css

const getInitialProfile = () => {
  const saved = localStorage.getItem("userProfile");
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  return {
    fullName: "Bạn",
    gender: "Khác",
    dobISO: "2000-01-02",
    email: "hxoa@gmail.com",
    avatar: null,
  };
};

export default function EditPostPage() {
  const { id } = useParams(); // id từ URL
  const postId = Number(id);
  const navigate = useNavigate();

  const profile = getInitialProfile();
  const stats = useMemo(() => ({ reputation: 100, fer: 100, fing: 100, group: 100 }), []);

  const [loading, setLoading] = useState(true);

  // fields
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [tags, setTags] = useState([]);
  const [tagText, setTagText] = useState("");
  const [image, setImage] = useState(null); // giữ ảnh cũ

  useEffect(() => {
    const saved = localStorage.getItem("posts");
    const list = saved ? JSON.parse(saved) : [];
    const found = list.find((p) => p.id === postId);

    if (!found) {
      alert("Không tìm thấy bài viết!");
      navigate("/profile/posts");
      return;
    }

    setTitle(found.title || "");
    setDesc(found.desc || "");
    setPrivacy(found.privacy || "public");
    setTags(found.tags || []);
    setImage(found.image || null);

    setLoading(false);
  }, [postId, navigate]);

  const addTag = () => {
    const t = tagText.trim();
    if (!t) return;
    if (tags.includes(t)) return;
    setTags((prev) => [...prev, t]);
    setTagText("");
  };

  const removeTag = (t) => setTags((prev) => prev.filter((x) => x !== t));

  const onSave = () => {
    const saved = localStorage.getItem("posts");
    const list = saved ? JSON.parse(saved) : [];

    const idx = list.findIndex((p) => p.id === postId);
    if (idx === -1) {
      alert("Không tìm thấy bài viết để lưu!");
      return;
    }

    const updated = {
      ...list[idx],
      title: title.trim() || "(Không tiêu đề)",
      desc: desc.trim(),
      privacy,
      tags,
      updatedAt: new Date().toLocaleString(),
      // image giữ nguyên (hoặc bạn có thể cho đổi ảnh sau)
      image,
    };

    const next = [...list];
    next[idx] = updated;

    localStorage.setItem("posts", JSON.stringify(next));
    alert("Cập nhật thành công ✅");
    navigate("/profile/posts");
  };

  if (loading) return null;

  return (
    <div className="vm-page">
      <SidebarProfile profile={{ ...profile, stats }} onLogout={() => alert("Logout (demo)")} />

      <main className="vm-main">
        <TopTabs active="posts" />
        <StatBar stats={stats} />

        <div className="cp-card">
          <div className="cp-title">Chỉnh sửa bài đăng</div>

          <input
            className="cp-input"
            placeholder="Tiêu đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="cp-textarea"
            placeholder="Nội dung bài viết"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={6}
          />

          <div className="cp-row">
            <label className="cp-field">
              <span>Chế độ</span>
              <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                <option value="public">Public</option>
                <option value="friends">Bạn bè</option>
                <option value="private">Private</option>
              </select>
            </label>
          </div>

          {image && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Ảnh hiện tại</div>
              <img src={image} alt="current" style={{ width: "100%", borderRadius: 14 }} />
            </div>
          )}

          <div className="cp-tagsBox">
            <div className="cp-tagsHeader">Tags (demo)</div>
            <div className="cp-tagsRow">
              <input
                className="cp-input"
                placeholder="Nhập tag..."
                value={tagText}
                onChange={(e) => setTagText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
              />
              <button className="cp-addBtn" onClick={addTag}>+ Tag</button>
            </div>

            <div className="cp-tags">
              {tags.map((t) => (
                <span key={t} className="cp-tag">
                  {t}
                  <button onClick={() => removeTag(t)}>x</button>
                </span>
              ))}
            </div>
          </div>

          <div className="cp-actions">
            <button className="cp-cancel" onClick={() => navigate(-1)}>Hủy</button>
            <button className="cp-post" onClick={onSave}>Lưu</button>
          </div>
        </div>
      </main>
    </div>
  );
}