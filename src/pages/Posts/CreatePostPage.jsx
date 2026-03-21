import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { postService } from "../../services/postService";
import "./createPostPage.css";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { USER_ID } = useOutletContext();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [files, setFiles] = useState([]); // File[]
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!title.trim() && !desc.trim() && files.length === 0) return;
    setLoading(true);

    try {
      let mediaUrls = [];
      if (files.length > 0) {
        mediaUrls = await postService.uploadPostMedia(files);
      }

      // Chuẩn bị payload cho backend
      const postData = {
        title: title.trim(),
        description: desc.trim(),
        location: location.trim(),
        duration_minutes: parseInt(duration) || null,
        max_participants: parseInt(maxParticipants) || null,
        media: mediaUrls.map(url => ({ url }))
      };

      await postService.createStatus(USER_ID, postData);

      
      // Sau khi lưu thành công vào DB, chuyển hướng về trang danh sách
      navigate(`/profile/${USER_ID}/posts`);
    } catch (error) {
      console.error("Lỗi khi đăng bài:", error);
      alert(`Đăng bài thất bại: ${error.error || error.message || "Lỗi server"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-wrap">
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

        <input
          className="cp-input"
          placeholder="Địa điểm (ví dụ: Công viên Tao Đàn)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <div className="cp-row">
          <input
            className="cp-input cp-half"
            placeholder="Thời lượng (phút)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <input
            className="cp-input cp-half"
            placeholder="Số người tối đa"
            type="number"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
          />
        </div>

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
        </div>

        <div className="cp-actions">
          <button className="cp-cancel" onClick={() => navigate(-1)} disabled={loading}>Cancel</button>
          <button className="cp-post" onClick={onSubmit} disabled={loading}>
            {loading ? "Đang đăng..." : "Đăng"}
          </button>
        </div>
      </div>
    </div>
  );
}