import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarProfile from "../../components/SidebarProfile/SidebarProfile";
import TopTabs from "../../components/TopTabs/TopTabs";
import StatBar from "../../components/StatBar/StatBar";
import "../profileLayout.css";
import "./createPostPage.css";

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

export default function CreatePostPage() {
  const navigate = useNavigate();
  const profile = getInitialProfile();
  const stats = useMemo(() => ({ reputation: 100, fer: 100, fing: 100, group: 100 }), []);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [files, setFiles] = useState([]); // File[]
  const [tagText, setTagText] = useState("");
  const [tags, setTags] = useState([]); // string[] (demo)

  const addTag = () => {
    const t = tagText.trim();
    if (!t) return;
    if (tags.includes(t)) return;
    setTags((prev) => [...prev, t]);
    setTagText("");
  };

  const removeTag = (t) => setTags((prev) => prev.filter((x) => x !== t));

  const onSubmit = () => {
    if (!title.trim() && !desc.trim()) return;

    // Lưu vào localStorage (demo). Sau này thay bằng call API backend.
    const saved = localStorage.getItem("posts");
    const current = saved ? JSON.parse(saved) : [];

    const imageUrl =
      files?.[0] && files[0].type.startsWith("image/")
        ? URL.createObjectURL(files[0])
        : null;

    const newPost = {
      id: Date.now(),
      title: title.trim() || "(Không tiêu đề)",
      time: new Date().toLocaleString(),
      desc: desc.trim(),
      image: imageUrl,
      privacy,
      tags,
      // demo reactions/comments/share
      reactions: { like: 0, love: 0, haha: 0 },
      comments: [],
      shares: 0,
    };

    localStorage.setItem("posts", JSON.stringify([newPost, ...current]));
    navigate("/profile/posts"); // quay về trang Posts
  };

  return (
    <div className="vm-page">
      <SidebarProfile profile={{ ...profile, stats }} onLogout={() => alert("Logout (demo)")} />

      <main className="vm-main">
        <TopTabs active="posts" />
        <StatBar stats={stats} />

        <div className="cp-card">
          <div className="cp-title">Tạo bài đăng</div>

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
              <span>Ảnh/Video</span>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
            </label>

            <label className="cp-field">
              <span>Chế độ</span>
              <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                <option value="public">Public</option>
                <option value="friends">Friend</option>
                <option value="private">Private</option>
              </select>
            </label>
          </div>

          <div className="cp-tagsBox">
            <div className="cp-tagsHeader">Gắn tag bạn bè (demo)</div>
            <div className="cp-tagsRow">
              <input
                className="cp-input"
                placeholder="Nhập tên bạn bè..."
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
            <button className="cp-cancel" onClick={() => navigate(-1)}>Cancel</button>
            <button className="cp-post" onClick={onSubmit}>Đăng</button>
          </div>
        </div>
      </main>
    </div>
  );
}