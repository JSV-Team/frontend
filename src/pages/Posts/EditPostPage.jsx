import { useEffect, useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { postService } from "../../services/postService";
import { buildAvatarUrl } from "../../services/apiProfileService";
import "./createPostPage.css"; // dùng lại css

export default function EditPostPage() {
  const { id } = useParams(); // id từ URL
  const postId = Number(id);
  const navigate = useNavigate();
  const { USER_ID, profile, stats } = useOutletContext();

  const [loading, setLoading] = useState(true);

  // fields
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [tags, setTags] = useState([]);
  const [tagText, setTagText] = useState("");
  const [image, setImage] = useState(null); // giữ ảnh cũ

  const { type } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const found = await postService.getPostById(postId, type);
        
        if (!found) {
          alert("Không tìm thấy bài viết!");
          navigate(`/profile/${profile?.username || USER_ID}/posts`);
          return;
        }

        // Map backend fields
        setTitle(found.title || found.content || "");
        setDesc(found.desc || found.description || found.content || "");
        setPrivacy(found.privacy || "public");
        setTags(found.tags || []);
        // Sử dụng buildAvatarUrl để hiển thị ảnh
        setImage(found.image_url || found.image || null);
      } catch (err) {
        console.error("Lỗi khi tải bài viết:", err);
        alert("Lỗi khi tải bài viết.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    if (postId && type) {
      fetchPost();
    }
  }, [postId, type, navigate]);

  const addTag = () => {
    const t = tagText.trim();
    if (!t) return;
    if (tags.includes(t)) return;
    setTags((prev) => [...prev, t]);
    setTagText("");
  };

  const removeTag = (t) => setTags((prev) => prev.filter((x) => x !== t));

  const onSave = async () => {
    try {
      let payload = {};
      if (type === 'status') {
        payload = {
          content: desc.trim() || title.trim(),
          image_url: image // giữ nguyên URL ảnh
        };
      } else {
        payload = {
          title: title.trim() || "(Không tiêu đề)",
          description: desc.trim(),
          privacy,
          location: "", // placeholder
          max_participants: 10,
          duration_minutes: 60
        };
      }

      await postService.updatePost(postId, payload, type);
      alert("Cập nhật thành công ✅");
      navigate(`/profile/${profile?.username || USER_ID}/posts`);
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      alert("Cập nhật thất bại.");
    }
  };

  if (loading) return null;

  return (
    <div className="cp-wrap">
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
            <img 
              src={buildAvatarUrl(image)} 
              alt="current" 
              style={{ width: "100%", borderRadius: 14 }} 
            />
          </div>
        )}

        <div className="cp-tagsBox">
          <div className="cp-tagsHeader">Tags (demo)</div>
          <div className="cp-tagsRow">
            <input
              className="ps-input" // Dùng chung style input của posts
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
    </div>
  );
}